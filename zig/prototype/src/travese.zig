const std = @import("std");
const Allocator = std.mem.Allocator;
const ContentMap = std.StringHashMap([]const u8);

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const source_dir = "sandbox/src/site";
    const dist_dir = "sandbox/dist";
    const content_dir = "sandbox/content";

    try std.fs.cwd().makePath(dist_dir);

    var content_map = ContentMap.init(allocator);
    defer {
        var iter = content_map.iterator();
        while (iter.next()) |entry| {
            allocator.free(entry.key_ptr.*);
            allocator.free(entry.value_ptr.*);
        }
        content_map.deinit();
    }

    try loadContent(allocator, &content_map, content_dir);
    try processAllFiles(allocator, &content_map, source_dir, dist_dir);
}

fn loadContent(allocator: Allocator, content_map: *ContentMap, content_dir: []const u8) !void {
    var dir = std.fs.cwd().openDir(content_dir, .{ .iterate = true }) catch |err| switch (err) {
        error.FileNotFound => return,
        else => return err,
    };
    defer dir.close();

    var walker = try dir.walk(allocator);
    defer walker.deinit();

    while (try walker.next()) |entry| {
        if (entry.kind == .file) {
            if (isArcFile(entry.basename)) {
                try processArcFile(allocator, content_map, dir, entry.path);
            } else if (isUiFile(entry.basename)) {
                try processUiFile(allocator, content_map, dir, entry.path);
            }
        }
    }
}

fn isArcFile(filename: []const u8) bool {
    return std.mem.endsWith(u8, filename, ".arc.md");
}

fn isUiFile(filename: []const u8) bool {
    return std.mem.endsWith(u8, filename, ".ui.md");
}

fn processArcFile(allocator: Allocator, content_map: *ContentMap, content_dir: std.fs.Dir, filepath: []const u8) !void {
    const content = try content_dir.readFileAlloc(allocator, filepath, 1024 * 1024);
    defer allocator.free(content);

    const relative_path = filepath[0 .. filepath.len - 7];
    const selector = try allocator.dupe(u8, relative_path);

    for (selector) |*char| {
        if (char.* == '/') {
            char.* = '.';
        }
    }

    var arc_content: []const u8 = "";
    if (std.mem.indexOf(u8, content, "# [@]")) |marker_pos| {
        const content_start = marker_pos + 5;
        arc_content = std.mem.trim(u8, content[content_start..], " \n\r\t");
    } else {
        std.debug.print("Warning: No '# [@]' marker found in {s}\n", .{filepath});
    }

    const content_copy = try allocator.dupe(u8, arc_content);
    try content_map.put(selector, content_copy);

    std.debug.print("Loaded ARC content: '{s}' -> '{s}' (content length: {})\n", .{ selector, content_copy[0..@min(50, content_copy.len)], content_copy.len });
}

fn processUiFile(allocator: Allocator, content_map: *ContentMap, content_dir: std.fs.Dir, filepath: []const u8) !void {
    const content = try content_dir.readFileAlloc(allocator, filepath, 1024 * 1024);
    defer allocator.free(content);

    const relative_path = filepath[0 .. filepath.len - 6];
    const base_selector_raw = try allocator.dupe(u8, relative_path);
    defer allocator.free(base_selector_raw);

    for (base_selector_raw) |*char| {
        if (char.* == '/') {
            char.* = '.';
        }
    }

    const sections = std.mem.splitSequence(u8, content, "\n\n\n");
    var section_iter = sections;

    while (section_iter.next()) |section_content| {
        const trimmed_section = std.mem.trim(u8, section_content, " \n\r\t");
        if (trimmed_section.len == 0) continue;

        var lines = std.mem.splitScalar(u8, trimmed_section, '\n');

        const section_name_line = lines.next() orelse continue;
        const section_name = std.mem.trim(u8, section_name_line, " \r\t");
        if (section_name.len == 0) continue;

        const pipe_line = lines.next() orelse continue;
        const trimmed_pipe = std.mem.trim(u8, pipe_line, " \r\t");
        if (!std.mem.eql(u8, trimmed_pipe, "|")) continue;

        var section_text = std.ArrayList(u8).init(allocator);
        defer section_text.deinit();

        var first_content_line = true;
        while (lines.next()) |line| {
            if (!first_content_line) {
                try section_text.append('\n');
            }
            try section_text.appendSlice(line);
            first_content_line = false;
        }

        const final_content = std.mem.trim(u8, section_text.items, " \n\r\t");
        if (final_content.len == 0) continue;

        const full_selector = try std.mem.join(allocator, ":", &[_][]const u8{ base_selector_raw, section_name });
        const content_copy = try allocator.dupe(u8, final_content);

        try content_map.put(full_selector, content_copy);
        std.debug.print("Loaded UI content: {s}\n", .{full_selector});
    }
}

fn processAllFiles(allocator: Allocator, content_map: *ContentMap, source_dir: []const u8, dist_dir: []const u8) !void {
    var dir = try std.fs.cwd().openDir(source_dir, .{ .iterate = true });
    defer dir.close();

    var walker = try dir.walk(allocator);
    defer walker.deinit();

    while (try walker.next()) |entry| {
        if (entry.kind == .file) {
            if (isHtmlFile(entry.basename)) {
                try processHtmlFile(allocator, content_map, dir, entry.path, dist_dir);
            } else {
                try copyFile(allocator, dir, entry.path, dist_dir);
            }
        }
    }
}

fn isHtmlFile(filename: []const u8) bool {
    const ext = std.fs.path.extension(filename);
    return std.ascii.eqlIgnoreCase(ext, ".html");
}

fn processHtmlFile(allocator: Allocator, content_map: *ContentMap, source_dir: std.fs.Dir, filepath: []const u8, dist_dir: []const u8) !void {
    const content = try source_dir.readFileAlloc(allocator, filepath, 1024 * 1024);
    defer allocator.free(content);

    const processed_content = try replaceTemplates(allocator, content_map, content);
    defer allocator.free(processed_content);

    const output_path = try std.fs.path.join(allocator, &[_][]const u8{ dist_dir, filepath });
    defer allocator.free(output_path);

    const output_dir = std.fs.path.dirname(output_path) orelse dist_dir;
    try std.fs.cwd().makePath(output_dir);

    const outputFile = try std.fs.cwd().createFile(output_path, .{});
    defer outputFile.close();
    try outputFile.writeAll(processed_content);

    std.debug.print("Processed: {s} -> {s}\n", .{ filepath, output_path });
}

fn copyFile(allocator: Allocator, source_dir: std.fs.Dir, filepath: []const u8, dist_dir: []const u8) !void {
    const output_path = try std.fs.path.join(allocator, &[_][]const u8{ dist_dir, filepath });
    defer allocator.free(output_path);

    const output_dir = std.fs.path.dirname(output_path) orelse dist_dir;
    try std.fs.cwd().makePath(output_dir);

    try source_dir.copyFile(filepath, std.fs.cwd(), output_path, .{});

    std.debug.print("Copied: {s} -> {s}\n", .{ filepath, output_path });
}

fn replaceTemplates(allocator: Allocator, content_map: *ContentMap, content: []const u8) ![]u8 {
    var result = std.ArrayList(u8).init(allocator);
    defer result.deinit();

    var i: usize = 0;
    while (i < content.len) {
        if (i + 1 < content.len and content[i] == '{' and content[i + 1] == '{') {
            const start = i;
            i += 2;

            var end: ?usize = null;
            var j = i;
            while (j + 1 < content.len) {
                if (content[j] == '}' and content[j + 1] == '}') {
                    end = j;
                    break;
                }
                j += 1;
            }

            if (end) |closing_brace| {
                const selector_content = content[i..closing_brace];
                const trimmed_selector = std.mem.trim(u8, selector_content, " \t\n\r");

                if (content_map.get(trimmed_selector)) |replacement| {
                    try result.appendSlice(replacement);
                } else {
                    try result.appendSlice(content[start .. closing_brace + 2]);
                }

                i = closing_brace + 2;
                continue;
            } else {
                try result.append(content[start]);
                i = start + 1;
                continue;
            }
        }

        try result.append(content[i]);
        i += 1;
    }

    return result.toOwnedSlice();
}

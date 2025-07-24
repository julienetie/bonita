const std = @import("std");

fn printHelp() void {
    std.debug.print(
        \\Usage:
        \\  --root <path> or -r <path>  Set the root path
        \\  --help, -h, help            Show this help message
        \\
    , .{});
}

const Args = struct {
    root_path: ?[]const u8 = null,
    help: bool = false,
};

pub fn cliArgs(allocator: std.mem.Allocator) !Args {
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);

    var parsed = Args{};
    var i: usize = 1;

    while (i < args.len) {
        const arg = args[i];
        if (std.mem.eql(u8, arg, "--root") or std.mem.eql(u8, arg, "-r")) {
            if (i + 1 >= args.len) {
                std.debug.print("Expected path after {s}\n", .{arg});
                return error.MissingRootPath;
            }
            parsed.root_path = args[i + 1];

            i += 2;
        } else if (std.mem.eql(u8, arg, "--help") or
            std.mem.eql(u8, arg, "-h") or
            std.mem.eql(u8, arg, "help"))
        {
            parsed.help = true;
            i += 1;
        } else {
            std.debug.print("Unknown argument: {s}\n", .{arg});
            return error.UnknownArgument;
        }
    }
    std.debug.print("// parsed // {s}\n", .{parsed.root_path orelse "<null>"});
    return parsed;
}

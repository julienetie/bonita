const std = @import("std");
const c = @cImport({
    @cInclude("quickjs.h");
    @cInclude("quickjs-libc.h");
});

// Define a struct to hold the parsed data
const UserData = struct {
    id: i32,
    name: [64]u8,
    score: f64,

    // Initialize with default values
    pub fn init() UserData {
        return .{
            .id = 0,
            .name = [_]u8{0} ** 64,
            .score = 0.0,
        };
    }
};

// Function to convert a JSValue object to a UserData struct
fn jsObjectToStruct(ctx: *c.JSContext, obj: c.JSValue) UserData {
    var data = UserData.init();

    // Extract 'id' (integer)
    const id_val = c.JS_GetPropertyStr(ctx, obj, "id");
    if (c.JS_IsNumber(id_val) != 0) {
        _ = c.JS_ToInt32(ctx, &data.id, id_val);
    }
    c.JS_FreeValue(ctx, id_val);

    // Extract 'name' (string)
    const name_val = c.JS_GetPropertyStr(ctx, obj, "name");
    if (c.JS_IsString(name_val) != 0) {
        const name = c.JS_ToCString(ctx, name_val);
        if (name) |n| {
            const len = @min(std.mem.len(n), data.name.len - 1);
            @memcpy(data.name[0..len], n[0..len]);
            data.name[len] = 0; // Ensure null-termination
            c.JS_FreeCString(ctx, n);
        }
    }
    c.JS_FreeValue(ctx, name_val);

    // Extract 'score' (double)
    const score_val = c.JS_GetPropertyStr(ctx, obj, "score");
    if (c.JS_IsNumber(score_val) != 0) {
        _ = c.JS_ToFloat64(ctx, &data.score, score_val);
    }
    c.JS_FreeValue(ctx, score_val);

    return data;
}

pub fn main() !void {
    // Initialize QuickJS runtime and context
    const rt = c.JS_NewRuntime() orelse {
        std.debug.print("Error: Could not create JS runtime\n", .{});
        return error.RuntimeCreationFailed;
    };
    defer c.JS_FreeRuntime(rt);

    const ctx = c.JS_NewContext(rt) orelse {
        std.debug.print("Error: Could not create JS context\n", .{});
        return error.ContextCreationFailed;
    };
    defer c.JS_FreeContext(ctx);

    // Load the user script (user.js)
    const file = try std.fs.cwd().openFile("sandbox/processors/manipulate-data.js", .{});
    defer file.close();

    // Read the entire file into a buffer
    const file_size = try file.getEndPos();
    const allocator = std.heap.page_allocator;
    const script = try allocator.alloc(u8, @intCast(file_size + 1));
    defer allocator.free(script);

    _ = try file.readAll(script[0..file_size]);
    script[file_size] = 0;

    // Evaluate the user script
    const result = c.JS_Eval(ctx, script.ptr, file_size, "user.js", c.JS_EVAL_TYPE_GLOBAL);
    if (c.JS_IsException(result) != 0) {
        const exception = c.JS_GetException(ctx);
        const error_msg = c.JS_ToCString(ctx, exception);
        if (error_msg) |msg| {
            std.debug.print("Error evaluating script: {s}\n", .{msg});
            c.JS_FreeCString(ctx, msg);
        }
        c.JS_FreeValue(ctx, exception);
        c.JS_FreeValue(ctx, result);
        return error.ScriptEvaluationFailed;
    }

    // Prepare JSON data to pass to the function
    const json_data = "{\"id\": 1, \"name\": \"Alice\", \"score\": 95.5}";
    const global_obj = c.JS_GetGlobalObject(ctx);
    const func = c.JS_GetPropertyStr(ctx, global_obj, "manipulateData");
    defer c.JS_FreeValue(ctx, global_obj);
    defer c.JS_FreeValue(ctx, func);

    if (c.JS_IsFunction(ctx, func) == 0) {
        std.debug.print("Error: 'manipulateData' function not found in user.js\n", .{});
        return error.FunctionNotFound;
    }

    // Convert JSON string to a JSValue object
    const json_val = c.JS_ParseJSON(ctx, json_data, json_data.len, "<input>");
    if (c.JS_IsException(json_val) != 0) {
        std.debug.print("Error parsing JSON data\n", .{});
        return error.JsonParsingFailed;
    }
    defer c.JS_FreeValue(ctx, json_val);

    // Call the JavaScript function with the JSON data
    var args = [_]c.JSValue{json_val};
    const ret = c.JS_Call(ctx, func, global_obj, 1, &args);
    if (c.JS_IsException(ret) != 0) {
        const exception = c.JS_GetException(ctx);
        const error_msg = c.JS_ToCString(ctx, exception);
        if (error_msg) |msg| {
            std.debug.print("Error calling function: {s}\n", .{msg});
            c.JS_FreeCString(ctx, msg);
        }
        c.JS_FreeValue(ctx, exception);
        c.JS_FreeValue(ctx, ret);
        return error.FunctionCallFailed;
    }
    defer c.JS_FreeValue(ctx, ret);

    // Convert the returned JSValue object to a UserData struct
    const user_data = jsObjectToStruct(ctx, ret);

    // Print the values of the struct
    std.debug.print("ID: {d}\n", .{user_data.id});
    std.debug.print("Name: {s}\n", .{&user_data.name});
    std.debug.print("Score: {d:.2}\n", .{user_data.score});
}

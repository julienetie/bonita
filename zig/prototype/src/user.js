function processData(data) {
    // Example manipulation: Add a timestamp and uppercase the name
    return {
        ...data,
        name: data.name.toUpperCase(),
        timestamp: new Date().toISOString(),
        processed: true
    };
}
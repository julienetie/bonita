var manipulateData = data => {
    // Manipulate the data (e.g., increment ID, modify name, and adjust score)
    data.id += 1;
    data.name = "Modified " + data.name;
    data.score += 5.0;

    return data;
}

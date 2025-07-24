var manipulateData = data => {
    
    data.id += 1;
    data.name = "Modified " + data.name;
    data.score += 5.0;

    return data;
}


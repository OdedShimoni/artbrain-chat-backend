function deleteByVal(val, obj) {
    for (var key in obj) {
        if (obj[key] == val) delete obj[key];
    }
}

module.exports = deleteByVal;
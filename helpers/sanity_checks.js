module.exports.is_blank = (data)=> {
    
    for (var member in data) {
        if(!data[member]) {
            return { 'is_blank':true , 'attribute': member };
        }
    }
    
    return { 'is_blank': false };
};
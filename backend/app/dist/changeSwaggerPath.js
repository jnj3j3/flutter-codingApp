const fs = require('fs');


const swaggerJason = fs.readFileSync('./dist/swagger-output.json');

var data = JSON.parse(swaggerJason);

function checkMethod(path){
    if(data.paths[path]['post'] !== undefined) 
        return ['post',data.paths[path]['post'].tags[0]]
    else if(data.paths[path]['get'] !== undefined)
            return ['get',data.paths[path]['get'].tags[0]]
    else if (data.paths[path]['put'] !== undefined)
        return ['put',data.paths[path]['put'].tags[0]]
    else if (data.paths[path]['delete'] !== undefined)
        return ['delete',data.paths[path]['delete'].tags[0]]
    else if (data.paths[path]['patch'] !== undefined)
        return ['patch',data.paths[path]['patch'].tags[0]]
    else
        return [null,null] 
}


for (path in data.paths) {
    const [method, tag] = checkMethod(path);
    switch(method){
        case 'post':
            data = JSON.parse(JSON.stringify(data).replace(path+'"','/'+tag+path+'"'))
            // console.log(data)
            break;
        case 'get':
            data = JSON.parse(JSON.stringify(data).replace(path+'"','/'+tag+path+'"'))
            // console.log(data)
            break;
        case 'put':
            data = JSON.parse(JSON.stringify(data).replace(path+'"','/'+tag+path+'"'))
            // console.log(data)
            break;
        case 'delete':
            data = JSON.parse(JSON.stringify(data).replace(path+'"','/'+tag+path+'"'))
            // console.log(data)
            break;
        case 'patch':
            data = JSON.parse(JSON.stringify(data).replace(path+'"','/'+tag+path+'"'))
            // console.log(data)
            break;
        default:
            console.log(path + 'not found method');
            break;
    }
}

fs.writeFileSync('./dist/swagger-output.json', JSON.stringify(data), 'utf-8', (err) => {
    if (err) throw err;
    console.log('Data added to file');
});

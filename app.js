var fs = require('fs-extra');
var findit = require('findit');
//操作目录
var operate_rootdir = "./projects/";

/**
 * 找到项目文件夹中的index.html文件，交给下一步
 * @param  {[type]}   project_path [description]
 * @param  {Function} next         [description]
 * @return {[type]}                [description]
 */
function findIndexFile(project_path, next) {
    var finder = findit(project_path);
    finder.on('file', function(file, stat) {
        if (/projects(\\|\/)[0-9a-zA-Z-\.]*(\\|\/).+\.json.?/gi.test(file)) {
            //console.log(file);
            next(file);
            //console.log("");
        }
    });
};
/* data_json*/
var data_json = null;

function readJsonData(json_path, callback) {
        fs.readFile(json_path, function(err, data) {
            if (err) throw err;
            data_json = JSON.parse(data);
            for (var ele in data_json) {
                //console.log(data_json[ele]);
            }
            callback();
            /*data_json.each(function(index, el) {
            	console.log("index:"+index+",el:"+el);
            });*/
            //data_json.push(req.body);
        });
    }
    /* Main here*/
findIndexFile(operate_rootdir, function(file) {
    //console.log(file);
    readJsonData(file, function() {

        var file_ls = [];
        var src_path = operate_rootdir + "91/a";
        var dest_path = operate_rootdir + "91/b";
        walk(file_ls, src_path, dest_path);
        console.log(file_ls);
        /*fs.copy(operate_rootdir + "src", operate_rootdir + "dest", function(err) {
            if (err) return console.error(err);
            console.log("success!");
        });*/
    });
});

/**
 * 遍历文件夹函数 深度优先
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function walk(file_ls, path, dest_path) {
    console.log(path);
    console.log(dest_path);
    //console.log("so the walk path is:" + path);
    var dirList = fs.readdirSync(path).toString().split(",");
    console.log("now dir info is:" + dirList.join("-"));
    var items_length = dirList.length;
    //console.log("items_length is:" + items_length);
    //dirList = dirList.slice(0, 10);

    var order = 0;

    function makeItemByOrder(dirList) {
        //console.log("now all in the folder is:" + dirList);
        //console.log("now folder name is:" + dirList[order]);
        //items_length = dirList.length;
        if (order < items_length) {
            if (fs.statSync(path + '/' + dirList[order]).isFile()) {
                //console.log(dirList[order] + "is dir!!!!!!");

                // ftp_client.mkdir(dest_path + '/' + dirList[order], function(err) {
                //     if (err) {
                //         /* do not throw err*/
                //         //throw err;
                //     } else {
                //         console.log("create dir good");
                //     }

                // });
                // 继续遍历

                file_ls.push(path + '/' + dirList[order]);
                //copies file
                fs.copy(path + '/' + dirList[order], dest_path + '/' + dirList[order], function(err) {
                    if (err) return console.error(err);
                    console.log("file copy success!")
                });
                //console.log("innner dirList[order] is:" + dirList[order]);
                //console.log("now the order is" + order);
                console.log("it is file");

            } else {
                /* 如果目录非空*/
                if (dirList[order]) {
                    /* 在目标文件夹建目录*/
                    var have_created = false;
                    var next_dest_path = dirList[order];
                    for (var ele in data_json) {
                        console.log(data_json[ele]);
                        if (dirList[order] == data_json[ele][1]) {
                            console.log("找到了这个文件夹:" + dirList[order]);
                            next_dest_path = data_json[ele][0];
                            //fs.mkdirSync(dest_path + '/' + data_json[ele][0]);
                            fs.ensureDir(dest_path + '/' + data_json[ele][0], function(err) {
                                console.log(err); //null
                                have_created = true;
                                //dir has now been created, including the directory it is to be placed in
                            });
                        } else {

                        }

                    }
                    if (!have_created) {
                        fs.ensureDir(dest_path + '/' + next_dest_path, function(err) {
                            console.log(err); //null
                            //dir has now been created, including the directory it is to be placed in
                        });
                    }
                    //console.log("空目录");
                    //console.log("it is dir");
                    walk(file_ls, path + '/' + dirList[order], dest_path + '/' + next_dest_path);
                }


            }
            order = order + 1;
            //console.log("you do not understand me:" + order);
            makeItemByOrder(dirList);

        } else {

        }

    }
    makeItemByOrder(dirList);

};

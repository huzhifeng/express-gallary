var fs = require('fs');
var path = require('path')
var util = require('util');
var wrench = require('wrench')
var root = './public/photo';

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.redirect('/gallary');
};

exports.random = function(req, res, next) {
  var i = 0;
  var len = 0;
  var file;
  var href;
  var type = 'video/mp4';
  var obj = {};
  var imgs = [];
  var randomImgs = [];
  var videos = [];
  var randomVideos = [];
  var indexLow = 0, indexHigh = 0;

  files = wrench.readdirSyncRecursive(root);
  if (!files) {
    console.log('readdirSyncRecursive() error');
    return res.redirect('/gallary');
  }
  len = files.length;
  for (i = 0; i < len; i++) {
    file = files[i].split(path.sep).reverse()[0];
    if (files[i].toLowerCase().indexOf('thumbnail') != -1) {
      continue;
    }
    href = util.format('/photo/%s', files[i].split('\\').join('/'));
    if (file.toLowerCase().indexOf('.jpg') != -1) {
      obj = {
        text : file,
        href : href,
        thumbnail : util.format('%s/_thumbnail/%s', href.split('/').slice(0,-1).join('/'), file)
      }
      imgs.push(obj);
    } else if (file.toLowerCase().indexOf('.mp4') != -1) {
      obj = {
        href : href,
        title : file,
        type : type,
        poster : util.format('%s/_thumbnail/%s.jpg', href.split('/').slice(0,-1).join('/'), file),
        sources : util.inspect([{href : href, type : type}])
      }
      videos.push(obj);
    }
  }
  if (imgs) {
    indexLow = Math.floor(Math.random() * imgs.length);
    indexHigh = (indexLow + 3) <= imgs.length ? (indexLow + 3) : imgs.length;
    randomImgs = imgs.slice(indexLow, indexHigh);
  }
  if (videos) {
    indexLow = Math.floor(Math.random() * videos.length);
    randomVideos = videos.slice(indexLow, indexLow + 1);
  }
  res.render('gallary', {
    layout : false,
    imgs : randomImgs,
    videos : randomVideos
  });
};

exports.gallary = function(req, res, next) {
  var isRoot = req.params[0] ? false : true;
  var param = isRoot ? '' : req.params[0];
  var navItems = isRoot ? [] : param.split('/');
  var dir = isRoot ? root : util.format('%s/%s', root, param);

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log('readdir() error: ' + err);
      return next(new Error(err.message));
    }
    var i = 0;
    var stats;
    var file;
    var href;
    var type = 'video/mp4';
    var obj = {};
    var menus = [];
    var dirs = [];
    var imgs = [];
    var videos = [];

    if (navItems) {
      for (i = 0; i < navItems.length; i++) {
        obj = {
          text : navItems[i],
          href : util.format('/gallary/%s', navItems.slice(0, i + 1).join('/'))
        };
        menus.push(obj);
      }
    }
    for (i = 0; i < files.length; i++) {
      file = files[i];
      if (file.toLowerCase().indexOf('thumbnail') != -1) {
        continue;
      }

      stats = fs.statSync(util.format("%s/%s", dir, file));
      if (stats.isDirectory()) {
        obj = {
          text : file,
          href : isRoot ? util.format('/gallary/%s', file) : util.format('/gallary/%s/%s', param, file)
        };
        dirs.push(obj);
      } else if (stats.isFile()) {
        if (file.toLowerCase().indexOf('.jpg') != -1) {
          href = isRoot ? util.format('/photo/%s', file) : util.format('/photo/%s/%s', param, file);
          obj = {
            text : file,
            href : href,
            thumbnail : util.format('%s/_thumbnail/%s', href.split('/').slice(0,-1).join('/'), file)
          };
          imgs.push(obj);
        } else if (file.toLowerCase().indexOf('.mp4') != -1) {
          href = isRoot ? util.format('/photo/%s', file) : util.format('/photo/%s/%s', param, file)
          obj = {
            href : href,
            title : file,
            type : type,
            poster : util.format('%s/_thumbnail/%s.jpg', href.split('/').slice(0,-1).join('/'), file),
            sources : util.inspect([{href : href, type : type}])
          };
          videos.push(obj);
        } else {
          console.log(file + ' is not a jpg or mp4');
        }
      }
    }
    res.render('gallary', {
      layout : false,
      menus : menus,
      dirs : dirs,
      imgs : imgs,
      videos : videos
    });
  });
};

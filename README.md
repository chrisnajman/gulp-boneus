# Gulp Boneus

## Aim

The aim of this project is to be able to develop a Wordpress theme in a folder *outside* of the main Wordpress installation. This allow you to  install the theme in another site simply by changing a couple of paths in `gulpfile.js`.

More specifically, I want to be able to:
* compile SCSS files into CSS files,
* have vendor-prefixes automatically prepended to CSS properties,
* reduce media-queries code,
* minify and concatenate separate CSS,
* have the ability to do the same with JS files,
* optimise image files,
* copy required non-development files to the build folder,
* see changes in the browser window as I update CSS/JS/HTML files without having to refresh it,
* synchronise the deletion of files in the dev folder to the build folder,
* completely separate dev and build tasks.

The theme I've chosen is 'Bones' (because all my sites are based on it. True, I usually take it apart, gut it, and replace a large part of it with my own code, but it's a great place to start).

##Differences between Boneus and Bones
The Boneus theme differs slightly from Bones (which is why I renamed it).

These differences are:

* `modernizr.min.js` has been moved from `library/js/lib` to `library/vendor` , and the `lib` folder has been deleted. This was because I didn't want Modernizr concatenated with `styles.js`. 
* In `library/bones.php` the path to `modernizr.min.js` has been updated.
* the link to `ie.css` (in `header.php`) is no longer contained within IE conditional tags. In fact, what I found is that the code which supposedly generated these tags didn't work, so they have been commented out in `bones.php`. To compensate for this I have made a few edits to `ie.css` (wrapper classes e.g. `.lte-ie9`, etc.
* Lastly, I've added an extra 'ie' class to the HTML elements in `header.php`.


## Assumptions
* You know something about Wordpress Theme Development (e.g. the function of `/style.cs`s in establishing a theme, how to activate the theme in Wordpress admin),
* You've got Wordpress installed on a local web server e.g. Xammp,
* You know something about SCSS/SASS,
* You know how to use the command line.

*Note: all command line instructions and local server paths are for Windows -- you'll have to google the Linux/Mac versions if you are using these platforms.*


## Acknowledgements
As mentioned previously, 99.9% of the files are identical to those of the Bones theme: (https://github.com/eddiemachado-zz/bones).

A great deal of the code found in `gulpfile.js` is taken from this excellent tutorial https://www.sitepoint.com/fast-gulp-wordpress-theme-development-workflow/ (to which I've made quite a few modifications).



## Use

### Setup
Before you can use **gulp-boneus** you'll need to first install `node.js` and then `npm` (Node Package Manager). 

For help with this, [How to Install and Use Node.js and npm (Mac, Windows, Linux)](https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/) is a straightforward guide.

Once this is done, download the files to a new project folder on your machine, launch a command prompt, navigate to your new project folder then type `npm install`. This will load up Gulp and all the required dependencies in a folder called `node_modules`.

* Activate your local server (e.g. XAMPP on Windows).

* Open `gulpfile.js` and scroll down to section 2.  Change the `dir build` path accordingly (the form of this path will vary according to whether you're using Linux, Windows or Mac. The example path in `gulpfile.js` is for Windows).

* Now scroll down to section 11. Change the file path in `proxy` to the `http/https` location of the  your own Wordpress installation on your local server.
*Note: the tutorial says that* `proxy: 'localhost'` *will launch your Wordpress site. This didn't work for me: I had to provide the full path.*

* Open a command prompt and navigate to the folder that contains `gulpfile.js`. Type 'gulp'. This will build the 'boneus' folder in `wp-content/themes/`. It will also watch any file changes made in `dev-boneus`.

* If everything is working, a new browser window will be launched containing your Wordpress site.

* Log in to `/wp-admin` and navigate to Appearance/Themes and enable the Boneus theme.

* For further testing make a few changes in the `.scss`, the `.js`, and/or the `.php` files. Changes you make should be immediately updated in the browser.

#### `gulpfile.js`
`gulpfile.js` is broken up into numbered sections (1-13). They are all annotated. I've provided a few additional notes below where I think further explanation is required: 

1) Configuration

2) Setup

3) PHP settings

4) Image settings

`.pipe(newer(images.build))`

`.pipe(cache(imagemin()))`
    
The first line looks for new images to process (minify).
The second caches existing minified images. This means that the minification process won't be repeated on already minified images.

5) CSS settings
No CSS folder is generated or exists in 'dev-boneus', only the 'scss' folder.

No SCSS folder is generated in 'boneus', only the CSS folder.

6) Javascript settings

`.pipe(deporder())`
    
The 'deporder' plugin is not actually in use, but it can be. The name is short for 'dependencies order'. A use case would be if you had separate .js files in dev-boneus/library/js/ e.g. 

* `functions.js`
* `scripts.js`

In this example, `scripts.js` requires `functions.js` in order to work properly.

`.pipe(concat(js.filename))`

will concatenate both files but not necessarily in the correct order and the functionality might not work.

To take advantage of 'deporder' you would have to type, at the very top of `scripts.js` the following:

`// requires: functions.js`

This will print the code in `functions.js` before the code in `scripts.js` in the concatenated file which is outputted to `bones/library/js`, i.e in the correct order.

If you decided to put functions.php in a sub-folder of dev-bones/library/ e.g. utilities/ then you would reference it as follows:

`// requires: utilities\functions.js`

Note the backslash ('\') in the filepath: this is for **Windows only**. The [documentation](https://www.npmjs.com/package/gulp-deporder) gives the filepath using the forward slash ('/') which I imagine is suitable for Linux (and maybe Mac). If one doesn't work, try the other one.

*Note: it doesn't matter what you call the files in* `dev-boneus/library/js` *- they will all be concatenated and minified into* `boneus/library/js/scripts.js`*.*

7) Copy tasks

Copy static files without processing them in any way.


8) Delete task

9) Clear cache task

10) Build task
Every time this task is run ('gulp build') in the command prompt the 'boneus' folder is rebuilt based on the contents of 'dev-boneus'.

11) Browsersync

12) Watch task
Every time this task is run ('gulp watch') in the command prompt a browser window will be launched loading the remote Wordpress installation and watching for changes to all files in 'dev-boneus'. Any changes will simultaneously be made in 'boneus' and the browser  updated with those changes.

Additionally, any file deleted in 'dev-boneus' will also be deleted in 'boneus'.

13) Default task

This combines the 'build' and 'watch' tasks. To run it, type 'gulp' in the command prompt.


## Finally
The `node_modules` folder takes up a lot of space on the hard drive. For this modest project it weighs in at size: 153.1mb / size on disk: 224mb.

Every new project will result in a comparable reduction of the available space on your machine.

Therefore, once your project is finished, It might be a good idea to delete the `node_modules` folder. If you ever want to work on it again all you have to do is navigate to the project via the command line and type `npm install` and all the modules will be reinstalled within a few minutes.

*Note: if you're looking for a* `gulpfile.js` *for small, non-dynamic projects take a look at [Gulp-Starter](https://github.com/chrisnajman/Gulp-Starter).*




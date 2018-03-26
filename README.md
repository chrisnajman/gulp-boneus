# gulp-boneus

## Description

* Install 'boneus' Wordpress theme in wp-content/themes/ from a remote folder.
* Further develop, watch and build the theme using Gulp, browsersync, etc.

'boneus' differs slightly from the theme it is built upon i.e. 'bones'. Therefore, I decided to rename it.

The differences are:

* modernizr.min.js has been moved from library/js/lib to library/vendor , and the 'lib' folder has been deleted. This was because I didn't want Modernizr concatenated with styles.js. In library/bones.php the path to modernizr.min.js has been updated.
* the link to ie.css (in header.php) is no longer contained within IE conditional tags. In fact, what I found is that the code which supposedly generated these tags didn't work, so they have been commented out in bones.php. To compensate for this I have made a few edits to the ie.css itself.

Note: if you're looking for something simpler take a look at [Gulp-Starter](https://github.com/chrisnajman/Gulp-Starter).

## Assumptions
* You know about Wordpress Theme Development
* You know something about SCSS/SASS
* You know how to use the command line

*Note: all command line instructions are for Windows -- you'll have to google Mac commands if you need them.*


## Acknowledgements
As mentioned previously, 99.9% of the files are identical to those of the 'Bones' theme: (https://github.com/eddiemachado-zz/bones).

A great deal of the code found in gulpfile.js was taken from this excellent tutorial https://www.sitepoint.com/fast-gulp-wordpress-theme-development-workflow/.



## Use

### Setup
Before you can use **gulp-boneus** you'll need to first install `node.js` and then `npm` (Node Package Manager). 

For help with this, [How to Install and Use Node.js and npm (Mac, Windows, Linux)](https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/) is a straightforward guide.

Once this is done, download the files to a new project folder on your machine, launch a command prompt, navigate to your new project folder then type `npm install`. This will load up Gulp, PostCSS, and their dependencies in a folder called 'node_modules'.

* Activate your virtual server (I use XAMPP on Windows).

* Open gulpfile.js and scroll down to section 2.  Change the dir build path accordingly (the form of this path will vary according to whether you're using Linux, Windows or Mac. The example path in gulpfile.js is for Windows).

* Now scroll down to section 11. Change the file path in 'proxy' to the http/https location of the  your own Wordpress installation on your virtual server.

* Open a command prompt and navigate to the folder that contains gulpfile.js. Type 'gulp'.

* If everything is working ok, a new browser window will be launched containing your wordpress site.

* For further testing make a few changes in the .scss, the .js, and/or the .php files. Changes you make should immediately update in the browser.

#### gulpfile.js
gulpfile.js is annotated and commented throughout, so it would be a good idea to read it. For example, if you want to change the launch browser (currently set to 'Chrome'), or have multiple browsers launch simultaneously,  instructions are in section 11. 



## Finally
The `node_modules` folder takes up a lot of space on the hard drive. For this modest project it weighs in at size: 153.1mb / size on disk: 224mb.

Every new project will result in a comparable reduction of the available space on your machine.

Therefore, once your project is finished, I would recommend that you delete the `node_modules` folder. If you ever want to work on it again all you have to do is navigate to the project via the command line and type `npm install` and all the modules will be downloaded within a few minutes.




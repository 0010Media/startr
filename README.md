startr
======

A simple personal homepage where you can manage your daily tasks &amp; notes 100% privately...

All the magic happens inside your browser, so all you will add here it's for your eyes only! 

> I open-sourced the project because this way anyone can see that **NO** information is sent elsewhere than on your local machine (localStorage). So no, no one's spying on you! you're safe!


###Demo

http://cookies.0010media.com/startr/



###Install

Just clone the project, add the startr.html file somewhere on your disk or on a server and you're ready to go. 

Set it as your start page and enjoy it :)


###Usage

#####NOTEPAD : 

The notepad text is automatically saved when the textbox loses its focus.

#####TASKS : 
A task contains : task name + tags + the project 

######Tags
The tags are defined as hashtags : `#my_tag` `#startr`

> Please note that there are several tags that have by default different colors : #idea + #bug - you can always add others from the code :)

You can easily display all the tasks associated to a tag by clicking on a tag name.  

######The Project Name
Tasks can be grouped in projects. To add a project, just add the `@` symbol followed by the project name in the task name.


######Examples

The order of the tags and the project is not important : 

`@startr Modify the README file #todo`  

is the same as   

`Modify the README file #todo @startr`  

and as  

`#todo Modify the README file @startr`  


###Features

1. **Todo List** 
2. **Notepad** 
3. **Import / Export** 

#### Other ideas

>  some of them will be implemented.... or all :) - who knows !

1. Weather
2. Google Calendar Agenda (display the events)
3. Links (open your favorite links quicker - have a favicon list or text based list)
4. Make `startr` available as a browser addon
5. Add the date to the finished tasks (this way you can have an idea when a task was done)
6. Allow the user to set a date to a task (will be eventually indicated in the interface by a small calendar icon displayed in front of the task's checkbox)
7. Make the finished taks list smaller and scrollable (when you have a lot of finished tasks, the list becames ugly - grey and ugly). Or hide it by default and have a link (finished tasks) that will display the list. Anyway, the current display of the finished tasks list must be changed
8. ...
 

#### Author(s) :
- Cristian CIOFU - www.iamchris.info


#### Credits :
- jQuery ==> http://jquery.com/
- modernizr ==> http://modernizr.com/
- normalize.css ==> http://necolas.github.io/normalize.css/
- savefile ==> http://savefile.joshmcarthur.com/

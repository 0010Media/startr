function taskNameToUppercase(taskName) {
    var allTheWords = taskName.split(/\s+/);
    $.each(allTheWords, function(i, value) {
        if (value.charAt(0) !== '#' && value.charAt(0) !== '@') { // check if the word is not a tag
            allTheWords[i] = value.charAt(0).toUpperCase() + value.slice(1); 
            return false;
        }
    });
    return allTheWords.join(' ');
}

function extractProjectName(title) {
    var projectName = '';
    if (title.match(/@(\S*)/g)) {
        $.each(title.match(/@(\S*)/g), function (i, v) {
            projectName = v.substring(1); // we'll always use the last project in the task's name (if multiple projects added)
        });
    }

    return projectName;
}


function replaceTaskName(id, oldTitle, newName) {
    // TODO : replace the task if we did not change the project 
    // rather than removing it and adding it at the end
    $('#task' + id).remove();

    // if we're going the change the project, let's clean the old project in case it has no more tasks in it
    var hasProject = extractProjectName(oldTitle);
    if (hasProject !== '' && !$("#project_" + hasProject + " div")[0]) {
        $("#project_" + hasProject).remove();
    }

    addItemToListTodo(id, newName);
}

function addItemToListTodo(id, title) {
    var projects = '';

    if (!$("#prj_allTasks")[0]) {
        $('#todoList').append('<div id="prj_allTasks"><h3 class="startr_projectName">Tasks</h3></div>');
    }
    
    if (title.match(/@(\S*)/g)) {
        
        $.each(title.match(/@(\S*)/g), function (i, v) {
            // we'll not add to the title of the task the last project (if there are multiple projects)
            // because this one will be in the header of the section
            if (i !== (title.match(/@(\S*)/g).length - 1)) { 
                projects += '<span class="project">' + v + '</span>' + '&nbsp;';
            }
        });
    }

    // let's build the projects sections (headers)
    var projectName = extractProjectName(title);
    if (projectName !== '' && !$("#project_" + projectName)[0]) {
        $('#todoList').append('<div id="project_' + projectName + '"><h3 class="startr_projectName">' + projectName.charAt(0).toUpperCase() + projectName.slice(1) + '</h3></div>');
    }
    
    var tagsClass = '';
    if (title.match(/#(\S*)/g)) {
        $.each(title.match(/#(\S*)/g), function (i, v) {
            tagsClass += ' ' + v.substring(1);
        });
    }

    // always make the task text's first letter uppercase!
    title = taskNameToUppercase(title);


    title = title.replace(/@(\S*)/g,''); // let's delete the projects (will be added at the start of the task name)
    title = title.replace(/#(\S*)/g,'<span class="tag $1">$1</span>'); // replace the tags
    
    // ok, now we'll add the projects
    if (projects !== '') {
        title = projects + ' ' + title;
    }

    var taskToAdd = '<div class="taskRow' + tagsClass + '" id="task' + id + '">' + 
                    '<div class="btnEdit editTask" data-id="' + id + '"></div>' + 
                    '&nbsp;' + 
                    '<input type="checkbox" class="checker" id="' + id + '"/> ' + 
                    '<label for="' + id + '">' + title + '</label></div>';

    // Let's see where we'll add the task - in a project or in the ALL PROJECTS group
    if (projectName != '') {
        $("#project_" + projectName).append(taskToAdd);
    }
    else {
        $('#prj_allTasks').append(taskToAdd);
    }

}


function addItemToListFinished(id, title) {
    // always make the task text's first letter uppercase!
    title = taskNameToUppercase(title);

    return '<div id="checkTask' + id + '">' + 
            '<div class="btnDelete deleteTask" data-id="' + id + '"></div>' + 
            '&nbsp;' + 
            '<input type="checkbox" checked="checked" class="unchecker" id="' + id + '"/> ' + 
            '<label for="' + id + '">' + title + '</label></div>';
}


if (Modernizr.localstorage) {
                
    Storage.prototype.setArray = function(key, obj) {
        return this.setItem(key, JSON.stringify(obj))
    }
    Storage.prototype.getArray = function(key) {
        return JSON.parse(this.getItem(key))
    }

    $(document).ready(function () {
        
        /* ********* DATA LOADER *********** */
        
        // get current todos
        var allTasks = window.localStorage.getArray("tasks");
        var allTasksArray = new Array(); // used for renaming a task

        if (allTasks) {
            $.each(allTasks, function(i, item) {
                if (item.checked) {
                    $('#todoListDone').append( addItemToListFinished(item.id, item.title) );
                }
                else {
                    addItemToListTodo(item.id, item.title);
                }
                allTasksArray[item.id] = item.title; // used for renaming a task
            });
        }
        else {
            allTasks = new Array();
        }

        // get notepad
        var notepadText = localStorage.getItem("notepad");
        if (notepadText) {
            $('#notepad').val(notepadText);
        }
        
        /* ****************************** */
        /* ****************************** */
        
        /* ********* TAG FILTER ******** */
        
        $(document).on('click', '#clearFilter', function(){ 
            $('.taskRow').show();
            $('#tasksBoxFilter').text('');
        });
        
        $(document).on('click', '.tag', function(e){ 
            var selectedTag = $(this).text();
            $('#tasksBoxFilter').html('Selected tag : #' + selectedTag + ' [<span id="clearFilter">clear</span>]');
            $('.taskRow').not('.' + selectedTag).hide();
            e.preventDefault();
        });
        
        /* ****************************** */
        /* ****************************** */
        
        /* ********* TASK ACTIONS (check & uncheck & delete) ******* */
        
        $(document).on('click', '.checker', function(){ 
            var checkedId = $(this).attr('id');
            $.each(allTasks, function(i, item) {
                if (item.id == checkedId) {
                    item.checked = true;
                    
                    $('#todoListDone').append( addItemToListFinished(item.id, item.title) );
                    $('#todoList #task' + item.id).remove();
                    
                    // check if there is a project and if it doesn't have any other tasks, let's delete it !!!
                    var hasProject = extractProjectName(item.title);
                    if (hasProject !== '' && !$("#project_" + hasProject + " div")[0]) {
                        $("#project_" + hasProject).remove();
                    }
                }
            });
            
            window.localStorage.setArray("tasks", allTasks);
        });
        
        $(document).on('click', '.unchecker', function(){ 
            var uncheckedId = $(this).attr('id');
            $.each(allTasks, function(i, item) {
                if (item.id == uncheckedId) {
                    item.checked = false;
                    
                    addItemToListTodo(item.id, item.title);
                    $('#todoListDone #checkTask' + item.id).remove();
                }
            });
            
            window.localStorage.setArray("tasks", allTasks);
        });
        
        /*
            Edit Task Name
         */
        $(document).on('click', '.editTask', function(){ 
            var taskId = $(this).data('id');
            var taskName = allTasksArray[$(this).data('id')];

            var newName = prompt("Please edit the task name below : ", taskName);
            
            $.each(allTasks, function(i, item) {
                if (item.id == taskId) {
                    if (newName != null) {
                        item.title = newName;
                        replaceTaskName(taskId, taskName, newName);
                        allTasksArray[taskId] = newName;
                    }
                }
            });
            window.localStorage.setArray("tasks", allTasks);
        });

        $(document).on('click', '.deleteTask', function(){ 
            // 
            // Delete confirmation was removed because it's not so funny to be asked each time 'are you sure???'
            // I'll see in the future if this was a bad idea or not :)
            //
            // var sure = confirm('Delete?');
            // if (sure) {
                deletedId = $(this).data('id');
                $.each(allTasks, function(i, item) {
                    if (item && item.id == deletedId) {
                        allTasks.splice(i, 1);
                        $('#todoListDone #checkTask' + item.id).remove();
                    }
                });
                window.localStorage.setArray("tasks", allTasks);
            // }
        });
            
        /* ****************************** */
        /* ****************************** */
        
        /* ********* TASK ACTIONS (buttons) ******* */
        
        $('#clearAll').click(function() {
            var sure = confirm('Are you sure you want to delete ALL the tasks?');
            if (sure) {
                localStorage.removeItem("tasks");
                allTasks = new Array();
                allTasksArray = new Array(); // used for renaming a task
                $('#todoList').html('');
                $('#todoListDone').html('');
            }
        });
        
        // add items by pressing enter
        $('#item').bind("enterKey",function(e){
           $('#add').click()
        });
        $('#item').keyup(function(e){
            if(e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });
        
        $('#add').click(function() {
            if ($('#item').val() !== '') {
                var $task = $('#item').val();
                var $id = $.now();
                
                allTasks.push({ id: $id, title: $task, checked: false });
                allTasksArray[$id] = $task; // used for renaming a task
                window.localStorage.setArray("tasks", allTasks);
                
                addItemToListTodo($id, $task);
                $('#item').val('');
                $('#item').focus();
                
            }
        });
        
        /* ****************************** */
        /* ****************************** */
        
        $('#notepad').blur(function() {
            if (notepadText !== $(this).val()) {
                localStorage.setItem("notepad", $(this).val());
                $('#notepadMessages').append('<div class="success">Your text has been successfully saved!</div>');
                $("#notepadMessages .success").delay(2000).hide(400, function() { $(this).remove(); } );
                notepadText = $(this).val();
            }
        });

        /*
            SETTINGS
        */
        $('#settingsPanelShow').click(function() {
            $('#settingsPanel').show(200);
        });
        $('#settingsPanelHide').click(function() {
            $('.settingsBox').hide(100);
            $('#settingsPanel').hide(200);
            $('.settingsItem').removeClass('activeSetting');
        });

        $('#export').click(function() {
            var allTasksExporter = window.localStorage.getArray("tasks");
            var itemData = '';
            var dataArray = Array();

            $('.settingsItem').removeClass('activeSetting');
            $(this).addClass('activeSetting');
            
            $.each(allTasksExporter, function(index, item) {
                 itemData = ( (item.checked) ? '1' : '0' ) + item.title;
                 dataArray.push(itemData);
            });
            
            $('.settingsBox').hide(100);
            $('#taskExporter').html(JSON.stringify(dataArray));
            $('#sExport').show(200);
        });

        $('#taskExporterSaveFile').click(function(event) {
            var d = new Date();
            var dDay = d.getDate();
            var dMonth = d.getMonth() + 1;
            var dYear = d.getFullYear();

            if (dMonth<10) {
                dMonth = '0' + dMonth;
            }

            var fileContent = $('#taskExporter').html();
            window.location = 'http://savefile.joshmcarthur.com/export_startr_' + dDay + '-' + dMonth + '-' + dYear + '.txt?content=' + encodeURIComponent(fileContent);
        });
        
        
        $('#import').click(function() {
            $('.settingsItem').removeClass('activeSetting');
            $(this).addClass('activeSetting');

            $('.settingsBox').hide(100);
            $('#sImport').show(200);
        });

        $('#importTasks').click(function() {

            var willRemoveExistingTasks = $('#importRemoveAllExisting').prop("checked");

            var toImport = $('#taskImporter').val();
            try {
                toImportData = JSON.parse(toImport);
            } catch (e) {
                alert("Something's wrong with the import data. Please try again!")
            }


            if (toImportData.length > 0) {
                var canAddTasks = true;
                if (willRemoveExistingTasks) {
                    var confirmMessage = 'Are you sure you want to import and remove all the current tasks?';
                    var sure = confirm(confirmMessage);
                    canAddTasks = false;
                    if (sure) {
                        localStorage.removeItem("tasks");
                        allTasks = new Array();
                        allTasksArray = new Array(); // used for renaming a task
                        $('#todoList').html('');
                        $('#todoListDone').html('');
                        
                        canAddTasks = true;
                    }
                }

                if (canAddTasks) {
                    $.each(toImportData, function(index, item) {
                        var id = $.now();

                        var itemDone = false;
                        if (item.charAt(0) == 1) {
                            itemDone = true;
                        }
                        var itemTitle = item.slice(1);

                        allTasks.push({ id: id, title: itemTitle, checked: itemDone });
                        allTasksArray[id] = itemTitle; // used for renaming a task
                        window.localStorage.setArray("tasks", allTasks);
                        
                        if (itemDone) {
                            $('#todoListDone').append( addItemToListFinished(id, itemTitle) );
                        }
                        else {
                            addItemToListTodo(id, itemTitle);
                        }
                    });
                    alert('The tasks were successfully imported')
                }
            }
            else {
                alert("Something's wrong with the import data. Please try again!")
            }
        });


    });
    
} else {
    // console.log('Ooops... no local storage!');
    $(document).ready(function () {
        $('#todoList').append('<h1>Sorry, your browser doesn\'t support localStorage. Please upgrade!</h1>');
        $('#item').attr('disabled', true);
        $('#add').attr('disabled', true);
        $('#clear').attr('disabled', true);
    });
}
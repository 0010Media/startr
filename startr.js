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

function addItemToListTodo(id, title) {
    var projects = '';
    if (title.match(/@(\S*)/g)) {
        $.each(title.match(/@(\S*)/g), function (i, v) {
            projects += '<span class="project">' + v + '</span>';
        });
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

    return '<div class="taskRow' + tagsClass + '" id="task' + id + '">' + 
            '<div class="btnEdit editTask" data-id="' + id + '"></div>' + 
            '&nbsp;' + 
            '<input type="checkbox" class="checker" id="' + id + '"/> ' + 
            '<label for="' + id + '">' + title + '</label></div>';
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
                    if (allTasks) {
                        $.each(allTasks, function(i, item) {
                            if (item.checked) {
                                $('#todoListDone').append( addItemToListFinished(item.id, item.title) );
                            }
                            else {
                                $('#todoList').append( addItemToListTodo(item.id, item.title) );
                            }
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
                            }
                        });
                        
                        window.localStorage.setArray("tasks", allTasks);
                    });
                    
                    $(document).on('click', '.unchecker', function(){ 
                        var uncheckedId = $(this).attr('id');
                        $.each(allTasks, function(i, item) {
                            if (item.id == uncheckedId) {
                                item.checked = false;
                                
                                $('#todoList').append( addItemToListTodo(item.id, item.title) );
                                $('#todoListDone #checkTask' + item.id).remove();
                            }
                        });
                        
                        window.localStorage.setArray("tasks", allTasks);
                    });
                    
                    $(document).on('click', '.editTask', function(){ 
                        console.log($(this).data('id'));
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
                            window.localStorage.setArray("tasks", allTasks);
                            
                            $('#todoList').append( addItemToListTodo($id, $task) );
                            $('#item').val('');
                            $('#item').focus();
                            
                        }
                    });
                    
                    /* ****************************** */
                    /* ****************************** */
                    
                    
                    $('#notepad').blur(function() {
                        localStorage.setItem("notepad", $(this).val());
                        $('#notepadMessages').append('<div class="success">Your text has been successfully saved!</div>');
                        $("#notepadMessages .success").delay(2000).hide(400, function() { $(this).remove(); } );
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
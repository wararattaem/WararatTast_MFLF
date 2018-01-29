var database = firebase.database();
var members_ref = database.ref('Employee');
var table = $('table tbody');
var radiochecked = "";



function getFormData() {
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var age = $('#age').val();
    var salary = $('#salary').val();
    var gender = $('[name=gender]:checked').val();

    return {
        firstname: firstname,
        lastname: lastname,
        age: age,
        salary: salary,
        gender: gender
    };
}


function addMember(event) {
    event.preventDefault();
    var member = getFormData();

    members_ref.push(member);
    $('form input').val('');
    $('form checked: radiochecked').val('');
}


function addMemberToDOM(is_update, member, key, row) {
    var el =
        '<tr data-key="' + key + '">' +
        '<td>' + member.firstname + '</td>' +
        '<td>' + member.lastname + '</td>' +
        '<td>' + member.age + '</td>' +
        '<td>' + member.salary + '</td>' +
        '<td>' + member.gender + '</td>' +
        '<td>' +
        '<button class="btn btn-info btn-sm update">Update</button>' +
        '<button class="btn btn-secondary btn-sm delete">Delete</button>' +
        '</td>' +
        '</tr>';

    if (is_update) {
        row.after(el);
        row.remove();
    } else table.append(el);
}


function updateMember(key, row) {
    var member = getFormData();
    addMemberToDOM(true, member, key, row);

    members_ref.child(key).set(member);
    $('form input').val('');
    $('form checked: radiochecked').val('');

    $('#submit')
        .unbind()
        .text('Submit')
        .on('click', addMember);
    $('#cancel').hide();
}


function getMember() {
    var row = $(this).parents('tr');
    var key = row.data('key');
    var member_ref = members_ref.child(key);
    var submit = $('#submit');

    member_ref.once('value')
        .then(function (member) {
            member = member.val();

            $('#firstname').val(member.firstname);
            $('#lastname').val(member.lastname);
            $('#age').val(member.age);
            $('#salary').val(member.salary);
            $('#gender').val(member.gender);

            submit.text('Update');
            submit.unbind().on('click', function (e) {
                e.preventDefault();

                updateMember(key, row);
            });
        });

    $('#cancel')
        .unbind()
        .show()
        .on('click', function (e) {
            e.preventDefault();
            $('form input').val('');
            $(this).hide();
            submit.text('Submit');
            submit.unbind().on('click', addMember);
        });
}


function deleteMember() {
    var row = $(this).parents('tr');
    var key = row.data('key');

    row.remove();
    members_ref.child(key).remove();
}


function getMembers() {
    members_ref.on('child_added', function (member) {
        var key = member.key;
        member = member.val();

        addMemberToDOM(false, member, key);
    });
}

function init() {
    getMembers();

    $("#submit").on("click", addMember);
    table.on('click', 'button.update', getMember);
    table.on('click', 'button.delete', deleteMember);
}

init();
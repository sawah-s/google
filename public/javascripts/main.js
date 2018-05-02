$('#gg').click(function() {
    $(this).hide();
    
    
    $.ajax({
        type:'post',
        url:'/get',
        dataType:'json',
        success:function (data) {
            if (data.error)
                {
                    show();
                    alert('لقد حصلت على حساب مسبقاً');
                    return;
                }
            if (jQuery.isEmptyObject(data)) {
                return alert('لا يوجد حسابات حالياً , عد لاحقاً')
            }
            $('#email').text(data.email);
            $('#password').text(data.pass);
            $('#im').show();
            $('#get').hide();
            
            
        },
        
        error:onErr 
    });
    
});

function onErr(err,mess)
{
   alert(mess);
    show();
    
}

function show(v)
{
    if (v !== false)
    $('#gg').show();
    else $('#gg').hide();
}
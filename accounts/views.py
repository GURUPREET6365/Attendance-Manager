from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from .tokens import emailVerificationtokenGenerator


# Create your views here.


from .forms import registerForm
def register(request):
    if request.method == "POST":
        print('found data..')
        form = registerForm(request.POST)
        print('error is:', form.errors)
        print('checking form....')
        if form.is_valid():
            print('form is now validated and it is valid')
            username = request.POST.get('username')
            email = request.POST.get('email')
            # now checking the database that is the user is already exists?
            print('checking username')
            user_exists_username = User.objects.filter(username=username, ).exists()
            if user_exists_username:
                response = {
                    'success':False,
                    'message': f'This username {username} is already exists, choose different one.'
                }
                return JsonResponse(response)
            
            print('checking email')
            user_exists_email = User.objects.filter(email=email, ).exists()
            if user_exists_email:
                response = {
                    'success':False,
                    'message': f'This email {email} is already exists, choose different one.'
                }
                return JsonResponse(response)
            print('saving user')
            user = form.save(commit=False)
            user.is_active = False
            
            # Here commit = False because we are saving into our ram for temporary because when we set commit = False, it doesn't run the model query to save it into db.

            token = emailVerificationtokenGenerator().make_token(user)

    return render(request, 'accounts/register.html')


# This is for login.
def login(request):
    return render(request, 'accounts/login.html')
import os

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = (
        os.getenv("GOOGLE_CALLBACK_URL") or "http://localhost:3000/auth/google/callback"
    )
    client_class = OAuth2Client

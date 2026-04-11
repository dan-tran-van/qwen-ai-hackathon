from rest_framework import generics


class ConversationListView(generics.ListAPIView):
    """
    API view to list all conversations for the authenticated user.
    """

from rest_framework import serializers


class MessageChatSerializer(serializers.Serializer):
    content = serializers.CharField()

    def validate(self, data):
        user = self.context["request"].user
        conversation = self.context["conversation"]
        if conversation.user != user:
            exception = serializers.ValidationError(
                "You do not have permission to add messages to this conversation."
            )
            raise exception
        return data

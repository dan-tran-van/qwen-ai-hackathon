from django.contrib import admin

from server.chats.models.conversation_model import Conversation
from server.chats.models.message_model import Message


# Register your models here.
class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    fields = ("role", "content", "order", "status", "created_at")
    readonly_fields = ("created_at",)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "last_message_at", "created_at")
    search_fields = ("title",)
    list_filter = ("created_at", "last_message_at")
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "conversation",
        "role",
        "content",
        "order",
        "status",
        "created_at",
    )
    search_fields = ("content",)
    list_filter = ("role", "status", "created_at")

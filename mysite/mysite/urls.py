
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('hustledesk.urls')),

    # Let the frontend's JS router handle all other routes
    re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html')),
]

# This is important for serving the static files (CSS, JS) from the frontend
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

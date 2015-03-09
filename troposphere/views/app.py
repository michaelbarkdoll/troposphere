import json

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, redirect, render_to_response
from django.template import RequestContext

from troposphere.version import get_version
from api.models import UserPreferences

from .maintenance import get_maintenance


def root(request):
    return redirect('application')


def _handle_public_application_request(request, disabled_login):
    template_params = {
        'access_token': request.session.get('access_token'),
        'emulator_token': request.session.get('emulator_token'),
        'emulated_by': request.session.get('emulated_by'),
        'disable_login': disabled_login
    }

    # If beta flag in query params, set the session value to that
    if "beta" in request.GET:
        request.session['beta'] = request.GET['beta'].lower()

    # If beta flag not defined, default it to false to show the old UI
    if "beta" not in request.session:
        request.session['beta'] = 'false'

    # Return the new Troposphere UI
    if request.session['beta'] == 'true':
        response = render_to_response(
            'index.html',
            context_instance=RequestContext(request)
        )

    # Return the old Airport UI
    else:
        response = render_to_response(
            'login.html',
            template_params,
            context_instance=RequestContext(request)
        )

    response.set_cookie('beta', request.session['beta'])
    return response


def _handle_authenticated_application_request(request, disabled_login):
    template_params = {
        'access_token': request.session.get('access_token'),
        'emulator_token': request.session.get('emulator_token'),
        'emulated_by': request.session.get('emulated_by'),
        'disable_login': disabled_login
    }

    if hasattr(settings, "INTERCOM_APP_ID"):
        template_params['intercom_app_id'] = settings.INTERCOM_APP_ID
        template_params['intercom_company_id'] = settings.INTERCOM_COMPANY_ID
        template_params['intercom_company_name'] = settings.INTERCOM_COMPANY_NAME

    user_preferences, created = UserPreferences.objects.get_or_create(user=request.user)

    # If beta flag in query params, set the session value to that
    if "beta" in request.GET:
        request.session['beta'] = request.GET['beta'].lower()
        show_beta_interface = True if request.session['beta'] == 'true' else False
        user_preferences.show_beta_interface = show_beta_interface
        user_preferences.save()
        return redirect('application')

    # Return the new Troposphere UI
    if user_preferences.show_beta_interface:
        response = render_to_response(
            'application.html',
            template_params,
            context_instance=RequestContext(request)
        )

    # Return the old Airport UI
    else:
        response = render_to_response(
            'cf2.html',
            template_params,
            context_instance=RequestContext(request)
        )

    return response


def application(request):
    response = HttpResponse()
    _, disabled_login = get_maintenance(request)

    if disabled_login:
        return redirect('maintenance')

    if request.user.is_authenticated():
        return _handle_authenticated_application_request(request, disabled_login)
    else:
        return _handle_public_application_request(request, disabled_login)


def forbidden(request):
    """
    View used when someone tries to log in and is an authenticated iPlant
    user, but was found to be unauthorized to use Atmosphere by OAuth.
    Returns HTTP status code 403 Forbidden
    """
    return render(request, 'no_user.html', status=403)


def version(request):
    v = get_version()
    v["commit_date"] = v["commit_date"].isoformat()
    v_json = json.dumps(v)
    return HttpResponse(v_json, mimetype='application/json')


def tests(request):

    template_params = {
        'test': request.GET['test'].lower()
    }

    return render(request, 'tests.html', template_params)

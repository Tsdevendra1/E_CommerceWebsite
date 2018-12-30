

class CheckHasSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        # Create a session
        if not request.session.session_key:
            request.session.save()
            request.session.modified = True
            print('creating session')

        # Code to be executed for each request/response after
        # the view is called.
        response = self.get_response(request)
        return response

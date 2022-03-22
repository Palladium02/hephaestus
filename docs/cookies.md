# Cookies

How you set cookies can be seen in the documentation for the response object.
The cookies object has one public method available for the developer which is
the `setSigned` method. This method is used to switch from normal cookies
to signed cookies. This method expects one parameter, the cookie secret.
The built-in cookie parser detect if a signed cookie was manipulated based on that
the value found in the `request.cookies` object might be different from what was
expect. If manipulated the value will instance of the NodeJS Error object.

Glass.js
==

# How it works

When your page loads, Glass.js attaches objects that represent your Rails models
in the `window` object under the `glass` namespace. So when you have a `User`
model in your Rails backend, Glass.js will create `glass.User` object that you
can access from anywhere in your JavaScript code.

Glass.js exposes functions such as `find`, `findAll`, `create`, `update` and
`delete` to handle XMLHTTPRequests to your backend, simplifying your CRUD API
calls.

## Find

Finds a list of records in a model with the passed parameters.

__Usage Example:__

The following usage example finds all users with the name "Foo".

```javascript
glass.User.find({
  name: 'Foo'
}, function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```


## Find All

Returns all rows in a model.

__Usage Example:__

The following usage example finds all users.

```javascript
glass.Users.find(function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```


## Create

Create a new record.

__Usage:__
```javascript
var user = {
  name: 'Jaune Sarmiento',
  email: 'hello@jaunesarmiento.me'
};

glass.Users.create(user, function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```

## Update

Update a record.


__Usage:__
```javascript
// Given our create() function returns the user object with 1 as id
var user = {
  id: 1,
  name: 'Joko'
};

glass.Users.update(user, function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```


## Delete

Delete a record.

```javascript
glass.User.delete(1, function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```


Please read [Glass](https://github.com/TeamSBK/glass) to learn more about the
setup instructions and usage of the gem.



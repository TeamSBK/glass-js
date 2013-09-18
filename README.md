Glass.js
==

__How it works__

When your page loads, Glass.js attaches objects that represent your Rails models
in the `window` object under the `glass` namespace. So when you have a `User`
model in your Rails backend, Glass.js will create `glass.User` object that you
can access from anywhere in your JavaScript code.

Glass.js exposes functions such as `find`, `findAll`, `create`, `update` and
`delete` to handle XMLHTTPRequests to your backend, simplifying your CRUD API
calls.


# Usage Examples

The following usage examples makes use of the Glass API given that you have a
`User` model in your Rails app and you have configured the Glass gem to expose it.

## Find

Finds a list of records in a model with 'Foo' as name.

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

The following usage example finds all users.

```javascript
glass.User.find(function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```


## Create

Create a new user record.

```javascript
var user = {
  name: 'Jaune Sarmiento',
  email: 'hello@jaunesarmiento.me'
};

glass.User.create(user, function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```

## Update

Update the user with `id == 1` and update its name to `Joko`.

```javascript
// Given our create() function returns the user object with 1 as id
var user = {
  id: 1,
  name: 'Joko'
};

glass.User.update(user, function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```


## Delete

Delete a user record with `id == 1`.

```javascript
glass.User.delete(1, function (res, error) {
  if (!error) {
    // Do something with res
  }
});
```


Please read [Glass](https://github.com/TeamSBK/glass) to learn more about the
setup instructions and usage of the gem.



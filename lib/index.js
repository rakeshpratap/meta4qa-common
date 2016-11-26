var assert = require('assert');
var request = require('request');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var debug = require('debug')("meta4qa:webapi");

var self = module.exports = function(learn, config, meta4qa) {
    assert(learn, "missing learn");
    assert(config, "missing config");
    assert(meta4qa, "missing meta4qa core");

    var Dialect = {};

    Dialect.Builder = require("./dialect/builder");
    Dialect.Common = require("./dialect/common");
    Dialect.Events = require("./dialect/events");
    Dialect.Files = require("./dialect/filesystem");
    Dialect.Transform = require("./dialect/transform");
    Dialect.Variables = require("./dialect/variables");

    _.each(Dialect, function(vocab, name) {
        vocab(learn,config, meta4qa);
    })

    self.feature = function(dialect, scope) {
        assert(dialect, "missing dialect");
        assert(scope, "missing scope");

        // initialize features
        _.each(Dialect, function(vocab, name) {
            if (_.isFunction(vocab.feature)) {
                vocab.feature(learn,config);
            }
        });
    };

    self.scenario = function(dialect, scope) {
        assert(dialect, "missing dialect");
        assert(scope, "missing scope");

        // initialize scenarios
        _.each(Dialect, function(vocab, name) {
            if (_.isFunction(vocab.scenario)) {
                vocab.scenario(dialect,scope);
            }
        });
    };

    self.annotations = function(dialect, annotations, scope) {
        assert(dialect, "missing dialect");
        assert(annotations, "missing annotations");
        assert(scope, "missing scope");

        // initialize request/response + targets + agents

        _.defaults(scope, {} );
        _.extend(scope, { stopwatch: {} } );

        // initialize scenarios
        _.each(Dialect, function(vocab, name) {
            if (_.isFunction(vocab.annotations)) {
                vocab.annotations(dialect,annotations, scope);
            }
        });
    };

    debug("understands common terms");
    return self;
};
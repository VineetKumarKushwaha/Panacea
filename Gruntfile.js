module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '0.0.0.0',
                    keepalive: true,
                    middleware: function (connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            // Include the proxy first
                            proxy
                        ].concat(defaultMiddleware);
                    }
                },
                proxies: [
                    {
                        context: '/api/',
                        host: '10.120.89.187',
                        port: 3000
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-connect');
   // grunt.loadNpmTasks('grunt-proxy');
        grunt.registerTask('serve',
        [
            'configureProxies:server',
            'connect:server'
        ]);

};
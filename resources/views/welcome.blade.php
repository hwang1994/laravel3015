<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <!-- <link rel="stylesheet" href="/css/bootstrap.min.css">
        <link rel="stylesheet" href="/css/all.min.css"> -->
        <title>COMP 4669</title>
        <link href="/assets/css/bootstrap.min.css" rel="stylesheet">
        <!-- <link href="/assets/font-awesome.min.css" rel="stylesheet" type="text/css"> -->
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
        <link href="/assets/css/style.css" rel="stylesheet">
    </head>
    <body>
        <div id="wrapper">

            <div class="container">

                <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                        <h1 class="login-panel text-center text-muted">
                            COMP 3015 Final Project
                        </h1>
                        <hr/>
                    </div>
                </div>

                <!-- <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                        <button class="btn btn-default" data-toggle="modal" data-target="#newItem"><i class="fa fa-photo"></i> New Item</button>
                        <a href="#" class="btn btn-default pull-right"><i class="fa fa-sign-out"> </i> Logout</a>
                        <a href="#" class="btn btn-default pull-right" data-toggle="modal" data-target="#login"><i class="fa fa-sign-in"> </i> Login</a>
                        <a href="#" class="btn btn-default pull-right" data-toggle="modal" data-target="#signup"><i class="fa fa-user"> </i> Sign Up</a>
                    </div>
                </div> -->
                <div class="col-md  " id="root"> 
                </div>
            </div>
        </div>
    </body>
    <script src="/js/app.js"></script>
    <script src="/assets/js/jquery.min.js"></script>
    <script src="/assets/js/bootstrap.min.js"></script>
</html>

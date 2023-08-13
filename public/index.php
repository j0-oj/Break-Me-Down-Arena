<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <title>Break Me Down</title>
  </head>

  <body>
        <div>
            <div class="d-flex vh-100 align-items-center justify-content-center">
                <div class="card bg-light d-flex justify-content-center align-items-center" style="width: 35rem;">
                    <div class='card-body'>
                        <h1 class="card-title text-center pt-4">Break Me Down Arena</h1>
                        <h5 class="card-text text-muted text-center pb-2">Crack and breakdown each room with your friends!</h5>
                        
                        <form method="post" action="signIn.php" >
                            <div class="form-group">
                                <label for="inputUsername" class="mb-1">Username</label>
                                <input type="username" name="username" class="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username">
                             </div>
                            <div class="form-group">
                                <label for="password" class="mb-1 mt-1">Password</label>
                                <input type="password" name="password" class="form-control" id="password" placeholder="Enter password">
                            </div>
                            <div class="d-grid gap-1 col-3 mx-auto mt-3 pb-4">
                                <input class="btn btn-primary" type="submit" value="Sign In" name="signIn">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    </body>
</html>


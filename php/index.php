<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <form action="index.php" method="post">
            Password: <input type="password" name="pass">
            <input type="submit">
        </form>
        <br>
        <?php
            //command in php that writes info to html doc
            //Use get variable from form to receive input from user
            echo $_POST["pass"]
        ?>

    </body>
</html>
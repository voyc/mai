Alex.
You asked for step-by-step instructions.

Step 1. Write a php program, like this.
<?php
echo "hi\n";
?>

Step 2. Run the program at the Linux command prompt.
# php test.php 
hi
#

Step 3. Edit the program and deliberately insert an error.
<?php
xecho "hi\n";
?>

Step 4. Run the program at the Linux command prompt.
# php test.php 
#

You see, the error is not reported back to me.


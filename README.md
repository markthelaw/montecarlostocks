# montecarlostocks
Simple demo of monte carlo simultion to estimate stock or index based on mean and standard deviation.

### Server : GO
### FrontEnd : AngularJS, Bootstrap, ChartJS

GO does the math calculation and send it back to frontend, it also uses a homebrew stat library: https://github.com/markthelaw/GoStatHelper
Using inverse error function.

It uses AngularJS to have a Ajax call to send/receive data from server and update the conclusion

It uses chartJS to draw the 2 charts.


##### Try it on heroku server: http://aqueous-sea-9400.herokuapp.com/web/

##### Note: Increase trials will dramatically slow down the drawing of the chart, max for runs is around 1000.

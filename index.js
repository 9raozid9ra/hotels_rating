const {Builder, By} = require('selenium-webdriver');
const fs = require('fs');
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// const service = new chrome.ServiceBuilder('./chromedriver');
const driver = new Builder().forBrowser('chrome').build();

const hotels = [];
(async ()=>{
    await driver.manage().window().maximize();
    await driver.get('https://www.booking.com/city/ma/rabat.fr.html');
    await sleep(1000);
    console.log('coki');
    for(let i=1; i<=4; i++){
        
        var h3 = await driver.findElement(By.xpath("/html/body/div[1]/div/div[5]/div[1]/div[2]/div[4]/div["+ i +"]/div[2]/div[1]/div[1]/header/a/h3/span[1]")).getText();
        var stars = await driver.findElement(By.xpath("/html/body/div[1]/div/div[5]/div[1]/div[2]/div[4]/div["+ i +"]/div[2]/div[1]/div[1]/header/a/h3/span[2]")).getText();
        var avis = await driver.findElement(By.xpath("/html/body/div[1]/div/div[5]/div[1]/div[2]/div[4]/div["+ i +"]/div[2]/div[1]/div[2]/div[1]/div[1]")).getText();
       
        var link =  await driver.findElement(By.xpath("/html/body/div[1]/div/div[5]/div[1]/div[2]/div[4]/div["+ i +"]/div[2]/div[1]/div[1]/header/a")).getAttribute("href");
        hotels[i-1] = {
            h3, stars, avis, link
        }
    }
    for (let index = 0; index < hotels.length; index++) {
        const link = hotels[index].link;
        await driver.get(link);
        await sleep(1000);
        await driver.executeScript('window.scrollTo({top:2626})');
        await sleep(1000);
      
        let comments = [];
        for (let index2 = 1; index2 <= 10; index2++) {
            var name = await driver.findElement(By.xpath(`/html/body/div[5]/div/div[5]/div[1]/div[1]/div[8]/div/div[2]/div[6]/div/div/div/div/ul/li[${index2}]/div/div/div[1]/div/div[2]/div[1]`));
            if ( name ) {
                var text = await driver.findElement(By.xpath(`/html/body/div[5]/div/div[5]/div[1]/div[1]/div[8]/div/div[2]/div[6]/div/div/div/div/ul/li[${index2}]/div/div/div[2]/div/div`));
                comments.push({
                    name: await name.getText(),
                    text: await text.getText()
                })
            };
        }
        hotels[index].comments = comments;

    }
    await driver.close();
    fs.writeFile('./hotels.json', JSON.stringify(hotels, null, 2), 'utf-8', (err) => {
        if(err) return console.log(err);
        console.log('done :)');
    });
})();
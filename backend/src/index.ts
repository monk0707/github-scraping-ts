
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import { Worker } from 'worker_threads';

import { batchPipelineFetch } from './controllers/fetchData';
import { batchPipelineSelenium } from './controllers/fetchSocialMediaData';

// const { parseHtml } = require('./fetch.js');

dotenv.config();

// database.connect();

const app = express();
const port:number = parseInt(process.env.PORT || '3001',10);

// app.use(cors({
//     origin: 'http://localhost:3000', // Your frontend URL
//     methods: ['GET', 'POST']
//   }));

// here the array of urls of 500 general company urls :

// let urls = [
//     "https://www.non-brokers.com/",
//     "https://tcgre.com/",
//     "https://devx.work/",
//     "https://www.anarock.com/",
//     "https://www.houseeazy.com/",
//     "http://www.triver.com/",
//     "http://www.triver.com/",
//     "https://www.kalpataru.com/",
//     "https://www.zapkey.com/",
//     "https://www.propertypistol.com/",
//     "https://devx.work/",
//     "https://www.stylework.city/",
//     "https://altdrx.com/",
//     "https://tablespace.com/",
//     "http://www.sushma.co.in/",
//     "https://www.propreturns.com/",
//     "https://www.tarc.in/",
//     "http://www.omaxe.com/",
//     "https://www.isprava.com",
//     "https://reloy.co/",
//     "http://www.hareen.in",
//     "http://quatreoinfocert.com",
//     "http://www.aurumventures.in",
//     "http://www.savaliyabuilders.com",
//     "http://supertrust.in",
//     "http://www.sunilagrawalandassociates.com",
//     "https://fincity.com",
//     "http://www.tvsemerald.com",
//     "http://njsvgroup.com",
//     "http://www.mountattalia.com",
//     "https://www.prithu.in",
//     "https://realtyassistant.in",
//     "https://www.liyaans.com",
//     "https://rebridz.com",
//     "https://www.bbgindia.com",
//     "http://www.plinthstone.com",
//     "http://thakkersdevelopers.com",
//     "https://www.vgn.in",
//     "http://nexplacerealty.com",
//     "http://propertyanthemindia.com",
//     "http://www.aaditrihousing.com",
//     "http://www.sonawanegroup.com",
//     "http://www.ahujahive.com",
//     "https://www.balaji-estate.com",
//     "https://www.glsinfra.in",
//     "https://www.mvninfrastructure.com",
//     "https://fortune99homes.com",
//     "https://magnoliarealty.in",
//     "http://www.parsvnath.com",
//     "https://www.inspiretechrealty.com",
//     "http://brookland.in",
//     "https://www.ubbergroup.com",
//     "http://mayagardengroup.com",
//     "http://srei.com",
//     "http://nashikcitycentre.com",
//     "http://www.ild.co.in",
//     "http://migsun.in",
//     "http://www.uniqueinfraspace.com",
//     "http://royalrealtorsgroup.in",
//     "http://www.raymondrealty.in",
//     "http://www.bombayrealty.in",
//     "http://www.nucleusofficeparks.com",
//     "http://www.columbiacommunities.in",
//     "http://www.smartworlddevelopers.com",
//     "http://oraiyangroups.com",
//     "http://www.clayworks.space",
//     "http://www.flowrealty.in",
//     "http://www.addressadvisors.com",
//     "http://thesettl.com",
//     "http://www.clairco.in",
//     "https://www.hindustantownships.com",
//     "http://www.asbl.in",
//     "http://www.ownerandtenant.com",
//     "http://propertyadviser.in",
//     "http://rahejas.in",
//     "http://www.urbanrise.in",
//     "http://www.bharathihomes.com",
//     "http://www.roodland.com",
//     "https://www.propdial.com",
//     "https://settlin.in",
//     "http://www.tymse.in",
//     "http://www.incuspaze.com",
//     "http://eclfinance.edelweissfin.com",
//     "http://kitchenscentre.com",
//     "http://www.balajiproperties.co.in",
//     "http://www.venturebriks.com",
//     "http://apexacreages.com",
//     "http://www.nobrokerhood.com",
//     "http://www.delhi2gurgaon.com",
//     "http://ascentinfra.in",
//     "https://birdhouse.co.in",
//     "http://focusrealty.co.in",
//     "http://www.parasrealtech.com",
//     "http://ayuni.in",
//     "http://globalrealestate.com",
//     "http://aryagroup.ind.in",
//     "https://www.nslinfratech.com",
//     "http://dreamsrealty.co.in",
//     "http://padmasritownships.blogspot.com",
//     "https://spnpropmart.com",
//     "http://www.incor.in",
//     "http://www.rahejauniversal.com",
//     "http://www.dsmaxproperties.com",
//     "http://www.abilgroup.com",
//     "http://www.sumadhuragroup.com",
//     "http://www.chddevelopers.com",
//     "http://www.investors-clinic.com",
//     "https://www.puranikbuilders.com",
//     "http://www.ajmera.com",
//     "http://www.rahejauniversal.com",
//     "http://www.ireoworld.com",
//     "http://www.ashianahousing.com",
//     "http://www.magicbricks.com",
//     "http://www.workflobyoyo.com",
//     "http://www.innov8.work",
//     "http://www.manishaconstructions.com",
//     "https://www.jonesfoundations.com",
//     "http://www.yashadarealty.com",
//     "http://www.estatesowl.com",
//     "https://www.instanthome.com",
//     "http://www.tdigroup.net",
//     "http://www.HeroHomes.in",
//     "http://www.yeskaybuilders.co.in",
//     "http://www.bhartiyacity.com",
//     "http://kalpataruproject.com",
//     "http://vamsirambuilders.com",
//     "http://www.theguardiansindia.com",
//     "http://www.unnatifortune.com",
//     "http://www.coworkanytime.com",
//     "http://coworkvalley.in",
//     "http://buildtechgroup.com.au",
//     "http://www.bricspaces.com",
//     "http://www.tablespace.work",
//     "http://www.nestavera.com",
//     "http://www.noveloffice.in",
//     "http://www.tain-con.com",
//     "http://www.sainathdevelopers.com",
//     "http://qparc.co.in",
//     "http://www.namangroup.com",
//     "http://assetmonk.io",
//     "https://www.urb.in",
//     "http://ckrealty.co.in",
//     "http://vmaksbuilders.com",
//     "http://fsrealty.co.in",
//     "http://ezeehousing.com",
//     "https://www.thegaragesociety.com",
//     "https://workshaala.com",
//     "http://www.dlf.in",
//     "http://www.realtimerealtors.in",
//     "http://www.savvglobal.com",
//     "http://www.vgn.in",
//     "http://www.skyeearth.in",
//     "http://zvesta.com",
//     "http://www.suchirindia.in",
//     "https://www.ovearth.com",
//     "http://www.indumaa.com",
//     "http://www.javdekars.com",
//     "http://candeurconstructions.com",
//     "http://www.mahaveergroup.in",
//     "https://www.jbinfraprojects.in",
//     "https://nanananihomes.in",
//     "http://abhinandanaavenues.net",
//     "http://vaishnavigroup.com",
//     "http://www.vatikagroup.com",
//     "http://www.lodha-groups.com",
//     "http://www.hubtown.co.in",
//     "https://www.tulipgroup.in",
//     "http://beegru.com",
//     "http://realtechnirman.com",
//     "https://www.shwasgroup.com",
//     "http://redbrixinfratech.com",
//     "http://www.wallfortproperties.com",
//     "http://www.homaxe.com",
//     "https://edenrealtygroup.com",
//     "http://www.dreamzshapers.com",
//     "http://www.indiabulls.com",
//     "http://www.roirealtors.com",
//     "http://www.billionairebucksindia.com",
//     "http://www.angeronaglobal.com",
//     "http://www.lakeshoreindia.in",
//     "http://florencehomes.in",
//     "http://www.signaturesattva.com",
//     "http://www.alphacorp.in",
//     "http://www.koltepatil.com",
//     "http://www.lojidoji.com",
//     "http://modeleconomictownship.com",
//     "http://www.marughar.com",
//     "http://www.ssrealtorsindia.com",
//     "http://www.myfollo.com",
//     "http://www.shipraworld.com",
//     "http://www.getinspirednow.in",
//     "http://www.indiconinternational.com",
//     "http://www.sumangalampropmart.com",
//     "http://www.fidelituscorp.com",
//     "http://www.kunvarjirealty.com",
//     "http://www.mls-india.in",
//     "http://www.goodwilldevelopers.com",
//     "http://www.aamanigroup.com",
//     "http://www.remax.in",
//     "http://smartworksoffice.com",
//     "http://www.dar.co.in",
//     "http://www.alliancein.com/?utm_source=Linkedin&utm_medium=ORSO&utm_campaign=Profile",
//     "http://renaissanceholdings.com",
//     "http://www.zuariinfra.com",
//     "http://www.squareyards.com",
//     "https://www.jindalrealty.com",
//     "https://www.mahindrahappinest.com",
//     "http://www.alembicrealestate.com",
//     "http://www.amarprakash.in",
//     "http://www.artizen.in",
//     "https://www.majestiqueproperties.com",
//     "http://www.efclimited.in",
//     "http://www.dreamspaceindia.com",
//     "http://www.realisticrealtors.com",
//     "http://www.silagroup.co.in",
//     "http://www.93avenuecommercialspace.com",
//     "http://whizdomindia.com",
//     "https://www.awfis.com",
//     "http://www.virginiamalls.in",
//     "http://www.rhymercorp.com",
//     "http://www.adiseshprojects.com",
//     "http://www.arsignature.in",
//     "http://www.august.in",
//     "http://www.ferozes.com",
//     "http://www.meraqiadvisors.com",
//     "http://www.skillpromoters.co",
//     "https://birdhouse.co.in",
//     "https://ashokpiramalgroup.com",
//     "http://www.xanadu.in",
//     "https://myhq.in",
//     "http://www.rishabhgroup.co.in/",
//     "http://www.nobroker.com",
//     "http://www.supertechlimited.com",
//     "https://www.awfis.com",
//     "http://www.futurerealtyindia.com",
//     "http://altfcoworking.com",
//     "http://www.realfinityrealty.com",
//     "http://www.templehomes.com",
//     "http://www.lutyenshabitat.com",
//     "http://www.aperonrealty.com",
//     "http://www.clairco.in",
//     "http://www.gundechabuilders.com",
//     "http://vtprealty.in",
//     "http://www.ecityventures.com",
//     "http://www.centuryrealestate.in",
//     "http://www.balajiproperties.co.in",
//     "http://www.nirmangroup.in",
//     "https://www.nobroker.in",
//     "http://www.capitalcity.adhiraj.co.in",
//     "http://www.guptapromoters.com",
//     "http://www.magicbricks.com",
//     "http://smartworksoffice.com",
//     "http://smartworksoffice.com",
//     "http://www.capitalcity.adhiraj.co.in",
//     "http://smartworksoffice.com",
//     "http://www.masterspmc.com",
//     "http://aliensgroup.in",
//     "http://www.brigadegroup.com",
//     "http://www.ashianahousing.com",
//     "http://aliensgroup.in",
//     "http://www.brigadegroup.com",
//     "http://www.thewadhwagroup.com",
//     "http://www.brigadegroup.com",
//     "http://www.proptiger.com",
//     "http://www.vegasmall.in",
//     "http://www.themerealty.com",
//     "http://skandhanshi.com",
//     "http://www.terraconprojects.net",
//     "http://www.vasuinfratech.com",
//     "http://www.reddvise.com",
//     "http://desaihomes.com",
//     "http://ceearrealty.com",
//     "http://www.lansumproperties.com",
//     "https://addressmaker.in",
//     "http://rohanbuilders.com",
//     "https://www.rislandindia.com",
//     "http://investorsclinic.in",
//     "http://www.eiplgroup.com",
//     "http://www.ruchiragroup.com",
//     "http://shathabdhitownships.com",
//     "http://www.sayahomes.in",
//     "http://www.sunindiadevelopers.com",
//     "http://www.indusvalleypl.com",
//     "http://www.remi.edu.in",
//     "http://www.saireniit.com",
//     "http://www.sreemitragroup.com",
//     "http://www.sreerosh.com",
//     "http://bkandhariproperties.com",
//     "http://vaneetinfra.com",
//     "http://www.dnrgroup.in",
//     "http://www.blackoliveventures.com",
//     "http://silverlinerealty.com",
//     "http://www.indiancityproperties.com",
//     "http://www.manoharrealty.com",
//     "http://www.propladder.com",
//     "http://www.vasupujya.com",
//     "http://www.purvanchalconstruction.com",
//     "http://www.remma.in",
//     "http://www.theshubhamgroup.com",
//     "http://worksquare.in",
//     "https://www.fourrwalls.com",
//     "http://www.42estates.com",
//     "http://neuleaflifespace.com",
//     "http://www.brisk.in",
//     "http://www.olivebuilder.com",
//     "http://sikar.org",
//     "https://www.casadel.com",
//     "http://mananiprojects.com",
//     "http://aashrithaa.com",
//     "http://investorhomesolutions.com",
//     "http://www.hhomes.in",
//     "http://www.bccbharatcity.in",
//     "http://www.ranjeetdevelopers.com",
//     "http://www.atmiyaproperties.com",
//     "http://www.azvenrealty.com",
//     "http://www.faiman.in",
//     "http://omaryanproperties.com",
//     "http://www.primepune.com",
//     "http://www.lakshmibalajirealty.com",
//     "http://www.srshti.com",
//     "http://www.aestheticarc.com",
//     "http://emmanuelconstructions.com",
//     "http://www.shreeenergygroup.com",
//     "http://www.vnbuildtech.com",
//     "http://www.iconsprop.com",
//     "http://www.shreeenergygroup.com",
//     "http://www.prajapatigroup.com",
//     "http://futureworldcare.com",
//     "https://www.paramountrealty.co.in",
//     "http://www.propertypistol.com",
//     "https://www.homekonnect.com",
//     "http://www.abode1st.com",
//     "http://riscity.com",
//     "http://www.satraproperties.in",
//     "http://www.arggroupjaipur.com",
//     "http://www.galaxyhomes.com",
//     "http://www.victoriancorp.com",
//     "http://www.corazonhomes.com",
//     "http://www.vastushodh.co.in",
//     "http://www.investadvise.in",
//     "http://www.bdigroup.co.in",
//     "http://www.catalystproperties.in",
//     "http://www.pcoc.in",
//     "http://bestechgroup.com",
//     "http://www.apeejaybusinesscentre.com",
//     "http://www.enkaycondominiums.com",
//     "http://www.propertypoint.net.in",
//     "http://shathabdhitownships.com",
//     "http://www.dronamaps.com",
//     "http://www.mantraproperties.in",
//     "http://www.bardiyagroup.com",
//     "http://www.yesproperty.co.in",
//     "http://www.proptiger.com",
//     "http://www.jll.co.in",
//     "http://www.proptiger.com",
//     "http://www.investoxpert.com",
//     "http://www.proptiger.com",
//     "http://www.squareyards.com",
//     "http://www.investoxpert.com",
//     "http://www.proptiger.com",
//     "http://www.vianaar.com",
//     "http://fanm.co.in",
//     "http://www.kartikinfratown.com",
//     "http://www.proptiger.com",
//     "http://shravanthigroup.com",
//     "http://www.the3c.in",
//     "http://www.dsmaxproperties.com",
//     "http://www.spaceindia.in",
//     "http://www.mistavenue.com",
//     "http://www.prarealty.co.in",
//     "http://www.propzapper.com",
//     "http://www.jncgroup.in",
//     "http://www.mspacerealty.com",
//     "http://www.amilagroup.com",
//     "http://www.yashrajproperties.com",
//     "http://www.prajapatigroup.com",
//     "http://edificelabs.com",
//     "http://www.niksglobalrealty.com",
//     "http://www.wellnestindia.com",
//     "https://www.chennaidreamhomes.com",
//     "http://www.bestpropertydeals.co.in",
//     "http://www.bubhandarilandmarks.com",
//     "http://www.neodevelopers.com",
//     "http://www.sippyhousing.com",
//     "http://capstonelife.in",
//     "http://www.rajwadagroup.in",
//     "http://www.olympeo.com",
//     "http://www.tuljaestate.com",
//     "http://www.realestaterealtors.in",
//     "http://www.gaursonsindia.com",
//     "http://www.satraproperties.in",
//     "http://www.ajmera.com",
//     "http://bhoomiinfracon.in",
//     "http://www.bbgindia.com",
//     "http://aarambhrealtech.com",
//     "http://www.jpinfra.com",
//     "http://www.kohinoorpune.com",
//     "http://www.housewise.in",
//     "http://www.proptiger.com",
//     "http://www.sobha.com",
//     "http://www.naiknavare.com",
//     "http://www.guptapromoters.com",
//     "http://www.sarojgroup.in",
//     "http://www.thewadhwagroup.com",
//     "https://www.360realtors.com",
//     "http://www.nirmangroup.in",
//     "http://www.magicbricks.com",
//     "http://www.thewadhwagroup.com",
//     "http://www.magicbricks.com",
//     "http://www.thephoenixmills.com",
//     "http://www.thewadhwagroup.com",
//     "http://www.atsgreens.com",
//     "https://regrob.com",
//     "http://www.proptiger.com",
//     "http://www.thephoenixmills.com",
//     "http://www.kushalbharat.com",
//     "http://www.dagainfratech.com",
//     "http://www.bptp.com",
//     "http://www.jkggroup.co.in",
//     "http://vasundharaprojects.com",
//     "http://www.propinindia.com",
//     "http://www.laureatebuildwell.com",
//     "http://www.pharandespaces.com",
//     "http://www.smcrealty.com",
//     "http://www.jagahunt.com",
//     "http://kgbuilders.com",
//     "https://wealth-clinic.com",
//     "http://www.ramprastha.com",
//     "http://www.ojasvingroup.com",
//     "http://www.infinityspace.in",
//     "http://www.greenlotusavenue.com",
//     "http://tricolour.co.in",
//     "http://www.malabardevelopers.com",
//     "http://gajpatihomes.in",
//     "http://www.dda.org.in",
//     "http://www.relivesolutions.com",
//     "http://www.alconvictorgroup.com",
//     "https://cerestra.in/",
//     "http://aarambhrealtech.com",
//     "http://www.shakespearepoint.com",
//     "http://sagarassociates.co.in",
//     "http://hbits.co",
//     "http://www.pacificindia.in",
//     "http://www.seias.in",
//     "http://www.gfpl.in",
//     "http://www.triver.co.in",
//     "http://www.navjeevanproperties.com",
//     "http://zcrex.com",
//     "http://www.ascens.in",
//     "http://www.kasturi.com",
//     "http://www.bsbuildtech.com",
//     "http://www.oakwoodasia.com",
//     "http://www.pranjee.com",
//     "http://www.bhumiworld.in",
//     "http://ushashi.in",
//     "http://www.giridhariconstructions.com",
//     "http://www.sharmaestates.com",
//     "http://www.greenovation.co",
//     "http://www.thakurgroupofcos.com",
//     "https://www.linkedin.com/redir/general-malware-page?url=http://www.naipropertyterminus.com",
//     "http://poojacraftedhomes.in",
//     "http://www.asianbuilders.in",
//     "http://www.margswarnabhoomi.com",
//     "http://garcorp.in",
//     "http://www.inkel.in",
//     "http://www.jayabherigroup.com",
//     "http://www.gruhamdevelopers.com",
//     "http://www.thevivansaa.com",
//     "http://www.instaspaces.in",
//     "http://www.hsjoshi.com",
//     "http://www.samsonandsons.com",
//     "http://www.infinitiindia.net",
//     "http://www.rtechgroup.co.in",
//     "http://cosmosdevelopers.com",
//     "http://www.spectrummetro.com",
//     "http://www.venkateshoxygroup.com",
//     "https://www.accesswork.in",
//     "http://www.redbrickoffices.com",
//     "http://www.dwarakagroup.com",
//     "http://www.embassyofficeparks.com",
//     "http://www.prozone.co.in",
//     "http://www.mfar.com",
//     "http://www.agarwalgroupofcompanies.com",
//     "http://www.sumerurealty.com",
//     "http://www.rajgroup.net",
//     "http://www.sricity.in",
//     "http://fortunepropmart.com",
//     "http://golflinks.in",
//     "http://investorsplanner.com",
//     "http://www.unibera.com",
//     "http://www.property-arena.com",
//     "http://www.propertyguruindia.com",
//     "http://www.accgroups.in",
//     "http://www.superbestategroup.com",
//     "http://www.surekhabuilders.com",
//     "http://www.paramhomes.com",
//     "http://www.intowngroup.in",
//     "http://www.property-arena.com",
//     "http://www.thegoldempire.com",
//     "http://www.homzcart.com",
// ]

let urls = [
    "https://www.linkedin.com/in/alexander-chiou/",
    "https://www.linkedin.com/in/arpit-singh-7b2666201/"
]

app.use(cors());

app.use(bodyParser.json()); 


app.get("/", (req : Request, res : Response) => {
    res.json({ urls });

    // const response = scrapeUrls(req,res,urls);

    // res.json(response);
    res.json ({
        message: "successful",
    })
});

// app.use("/api/scrape", scrapeRoutes);
interface FetchResult { content: string, url: string, status: number, statusText: string }

app.post("/augment", (req: Request, res : Response) => {
    /**
     * The body of the request should be an object with the following structure:
     * {
     *    results: [
     *     {
     *      url: string,
     *      content: string
     *     }
     *    ]
     * 
     * @type {{ results: { url: string, content: string }[] }}
     */
    const body: { results: FetchResult[] } = req.body;

    console.log("the urls are with fetched data ", body);

    // bodyType = { results: [{ "url": string, "content", string}]}

    // const socialMediaUrls = body.results.filter(result => {
    //     return ['linkedin.com', 'g2.com', 'reddit.com'].some(domain => result.url.includes(domain));
    // });

    // const otherUrls = body.results.filter(result => {
    //     return !['linkedin.com', 'g2.com', 'reddit.com'].some(domain => result.url.includes(domain));
    // });

    const urlsNotFetched = body.results.filter(result => {
        return result.status !== 200;
    });

    // so I got the urls which are not fetched. Now write a function to fetch these urls 

    batchPipelineFetch(urlsNotFetched.map(result => result.url)).then((response) => {
        // console.log("Backend fetching : non-social media urls : ", response.responses);
        // console.log("Backend fetching : social media urls : ", response.socialMediaResponses);
        res.json({
            message: "successful",
            otherUrls: response.responses,
            urlsNotFetched: urlsNotFetched
        });

    }).catch((error: any) => {
        res.status(500).json({
            message: "unsuccessful",
            error: error
        });
    });
    // now we have to scrape social media urls and other urls separately. and send the results to the llm : 

    // const scrapableUrls = body.results.filter(result => { return result.url
    // .match(/(linkedin\.com|g2\.com)/);
    // });

    // const scrapedDataFromSearch = scrapableUrls.map(result => {
    //     return {...result, content: parseHtml(result.content)};
    // })

    // Now send it to the LLM for generating response.

    // const responses = scrapedDataFromSearch.map(result => {
    //     return llm.send(result.content);
    // });
});

// app.post('/scrapeSelenium', (req: Request, res: Response) => {
//     // what to do now : 

//     const body: { results: FetchResult[] } = req.body;

//     console.log("the urls are with fetched data ", body);

//     // bodyType = { results: [{ "url": string, "content", string}]}

//     const urlsNotFetched = body.results.filter(result => {
//         return result.status !== 200;
//     });

//     // so I got the urls which are not fetched. Now write a function to fetch these urls 

//     interface seleniumResults {
//         seleniumResponses: FetchResult[],
//     }

//     batchPipelineSelenium(urlsNotFetched.map(result => result.url), process.env.PROXY_LIST ? process.env.PROXY_LIST.split(',') : []).then((response) => {
//         // console.log("Backend fetching : non-social media urls : ", response.responses);
//         // console.log("Backend fetching : social media urls : ", response.socialMediaResponses);
//         res.json({
//             message: "successful",
//             otherUrls: response.seleniumResponses,
//             urlsNotFetched: urlsNotFetched
//         });

//     }).catch((error: any) => {
//         res.status(500).json({
//             message: "unsuccessful",
//             error: error
//         });
//     });

// });


// selenium scraping with worker thread

app.post('/scrapeSelenium', (req: Request, res: Response) => {
    const body: { results: FetchResult[] } = req.body;

    console.log("The URLs are with fetched data:", body);

    const urlsNotFetched = body.results.filter(result => {
        return result.status !== 200;
    });

    // Prepare the data for the worker
    console.log('before preparing data for worker');
    const workerData = {
        urlsToScrape: urlsNotFetched.map(result => result.url),
        proxyList: process.env.PROXY_LIST ? process.env.PROXY_LIST.split(',') : [],
    };

    console.log('after preparing data for worker');

    // Create a new worker and pass the workerData
    const worker = new Worker('./seleniumWorker.ts', {
        workerData,
    });

    console.log('worker is ', worker)

    console.log('after creating worker');

    // Handle the result from the worker
    worker.on('message', (message) => {
        console.log('inside message');
        if (message.status === 'success') {
            // Send the successful result back to the client
            console.log('hello');
            res.json({
                message: 'successful',
                seleniumResponses: message.response.seleniumResponses,
                urlsNotFetched,
            });
        } else if (message.status === 'error') {
            // Handle the error
            console.log('hi');
            res.status(500).json({
                message: 'unsuccessful',
                error: message.error,
            });
        }
    });

    console.log('after handling message');

    // Handle any errors from the worker
    worker.on('error', (error) => {
        res.status(500).json({
            message: 'unsuccessful',
            error: error.message,
        });
    });

    console.log('after handling error');

    // Handle when the worker finishes
    worker.on('exit', (code) => {
        if (code !== 0) {
            res.status(500).json({
                message: 'unsuccessful',
                error: 'Worker thread exited with code ' + code,
            });
        }
    });

    console.log('after handling exit');
});

// app.get('/alchemyst-ai/scrape',scrapeUrls);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

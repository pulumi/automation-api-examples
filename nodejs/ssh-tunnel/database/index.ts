import * as pg from "@pulumi/postgresql";

const database1 = new pg.Database("main1");
const database2 = new pg.Database("main2");
const database3 = new pg.Database("main3");

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
function load(file) {
  const calls = [];
  const context = { exports: {}, require: createRequire(file), Buffer, URL, URLSearchParams,
    console: { log(){}, error(){} }, process: { env: { ADMIN_USERNAME:'test-only', ADMIN_PASSWORD:'test-only', JWT_SECRET:'test-only', RESEND_API_KEY:'test-only', BREVO_API_KEY:'test-only', BREVO_FROM_EMAIL:'test@example.invalid' } },
    fetch: async (url, options) => { calls.push({url, data:JSON.parse(options.body)}); return {ok:true,json:async()=>({}),text:async()=>''}; } };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, {filename:file});
  return {handler:context.exports.handler, calls};
}
(async () => {
 for(const [site,domain] of [['husni','husnihalim.com']]) {
  const helper = require(`${root}/netlify/functions/lib/enquiry-source.cjs`);
  assert.equal(helper.enquirySource({sourcePage:`https://${domain}/oee/?email=private#contact`}, site).sourcePage, `https://${domain}/oee/`);
  assert.equal(helper.enquirySource({sourcePage:'https://evil.example/pretend'},site).sourcePage,'');
  assert.equal(helper.enquirySource({},site).sourceWebsite,domain);
  assert(!helper.sourceRows({sourcePage:'<script>alert(1)</script>'}).includes('<script>'));
  const test = load(`${root}/netlify/functions/cms.js`);
  const result = await test.handler({httpMethod:'POST',path:'/api/cms/contact',headers:{origin:`https://${domain}`},queryStringParameters:{},body:JSON.stringify({site,name:'SEO Test',email:'test@example.invalid',phone:'+60123456789',message:'Test enquiry context only.',consent:true,'form-started-at':String(Date.now()-10000),sourcePage:`https://${domain}/oee/?secret=omit`,sourceForm:'service-enquiry'})});
  assert.equal(result.statusCode,200, result.body);
  const notice = test.calls.find(c=>c.data.subject?.includes('New'));
  assert(notice, 'owner notification produced');
  assert(notice.data.subject.includes(domain));
  const html=notice.data.html||notice.data.htmlContent;
  assert(html.includes(`https://${domain}/oee/`));assert(!html.includes('secret=omit'));
  console.log(`${domain}: CMS notification includes website and page; URL queries omitted`);
 }
 const blog = load(`${root}/netlify/functions/submission-created.js`);
 const data={name:'SEO Test',email:'test@example.invalid',phone:'+60123456789',page:'https://husnihalim.com/blog/oee/?secret=omit'};
 const b=await blog.handler({body:JSON.stringify({form_name:'blog-enquiry',data})});assert.equal(b.statusCode,200,b.body);
 assert(blog.calls.some(c=>c.data.subject?.startsWith('[husnihalim.com]')));
 assert(blog.calls.every(c=>!c.data.html?.includes('secret=omit')));
 // Source fields are clean; legacy page field must be normalised too.
 const floor=load(`${root}/netlify/functions/submit-form.js`);
 const f=await floor.handler({httpMethod:'POST',body:new URLSearchParams({firstname:'SEO',lastname:'Test',email:'test@example.invalid',phone:'+60123456789','form-started-at':String(Date.now()-10000),sourcePage:'https://husnihalim.com/assessment/',sourceForm:'floor-assessment'}).toString()});assert.equal(f.statusCode,200,f.body);
 assert(floor.calls.some(c=>c.data.subject?.startsWith('[husnihalim.com]')&&c.data.html.includes('/assessment/')));
 console.log('Husni article and floor-assessment notifications include website and page. No external requests made.');
})().catch(e=>{console.error(e);process.exitCode=1});

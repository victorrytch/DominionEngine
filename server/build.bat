cd node_includes
del node_includes.js
del node_includes.d.ts
call tsc
copy node_includes.d.ts ..\api\includes\
copy node_includes.d.ts ..\service\includes\

cd ..\engine
del engine.js
del engine.d.ts
call tsc
copy engine.d.ts ..\api\includes\
copy engine.d.ts ..\service\includes\

cd ..\service
del service.js
del service.d.ts
call tsc
copy service.d.ts ..\api\includes\

cd ..\api
del api.js
del api.d.ts
call tsc

cd ..\
copy .\node_includes\node_includes.js+.\engine\engine.js+.\service\service.js+.\api\api.js /a app.js /b /y
pause

node app.js
pause
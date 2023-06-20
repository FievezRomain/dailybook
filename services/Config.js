const myIp = 'locahost';

const devUrl = "http://"+myIp+"3000";
const prodUrl = "https://mydailybook.fr";

const currentUrl = devUrl;

export function getBaseUrl(){
    return(
        `${currentUrl}/api/v1/`
    );
}

export function getParamsUrl(params) {
	const paramsFilled = params.filter(
		(value) => value.value != null && value.value !== ""
	);
	const arrayParams = paramsFilled.map(
		(paramUrl) => `${paramUrl.key}=${paramUrl.value}`
	);
	const nbParamsFilled = arrayParams.length;
	let paramsUrl = nbParamsFilled === 1 ? arrayParams[0] : arrayParams.join("&");

	return paramsUrl !== "" ? `?${paramsUrl}` : "";
}

export function getFilePath(path) {
  return (
    `${currentUrl}/${path}`
  );
}

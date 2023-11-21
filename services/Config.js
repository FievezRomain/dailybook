const myIp = '192.168.1.44:';

const devUrl = "http://"+myIp+"8080";
const prodUrl = "https://mydailybook.fr";
const imageUrl = "ressources/images/";

const currentUrl = devUrl;

export function getBaseUrl(){
    return(
        `${currentUrl}/`
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

export function getImagePath() {
	return (
		`${currentUrl}/${imageUrl}`
	  );
}

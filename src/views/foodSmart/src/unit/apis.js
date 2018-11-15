const exportBase = '/ureport/excel?_u=path*:';

const getBaseUrl = () => {
	let base = window.location.href;
	let index = base.indexOf('#');
	if (index > -1) {
		base = base.slice(0, index);
	} else {
		base = window.location.href;
	}
	return base
}

export default {
	BASE: process.env.NODE_ENV == 'development' ? '/pro' : '', // 接口请求基地址

	BASE_URL: process.env.NODE_ENV == 'development' ? getBaseUrl() + 'pro' : getBaseUrl(), // window.open基地址
	

}
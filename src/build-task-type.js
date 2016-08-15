const buildTaskType = (prefix, type) => {
	if (!prefix) return type;
	return `${prefix}:${type}`;
};

module.exports = buildTaskType;

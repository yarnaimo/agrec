module.exports = {
    hooks: {
        ...require('@yarnaimo/tss/.huskyrc.js').hooks,
        'post-merge': 'yarn build',
    },
}

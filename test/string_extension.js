describe(__filename, () => {
  describe(`string().numeric() - 支援檢查數字格式`, async () => {
    cc.string.postRule.numeric = (helper) => {
      if (!Number.isNaN(Number(helper.getInput()))) return
      helper.markError(`{#label#} should be numerical`)
    }

    const errMsg = `the input should be numerical`

    it(`通過: '123'`, async () => {
      const input = `123`
      const info = await cc.string().numeric().parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`通過: '12.3'`, async () => {
      const input = `12.3`
      const info = await cc.string().numeric().parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`不通過: 'str123'`, async () => {
      const input = `str123`
      const info = await cc.string().numeric().parse(input)
      assert.strictEqual(info.error, errMsg)
    })
  })

  describe(`string().alphanumeric(options = {symbol = '', alphaMin = 1, numberMin = 1}) - 支援檢查英文+數字格式`, async () => {
    cc.string.postRule.alphanumeric = (helper, opt = {}) => {
      let {symbol = '', alphaMin, numberMin} = opt
      const escapeSymbol = symbol.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

      alphaMin = helper.extractRef(alphaMin) || 1
      numberMin = helper.extractRef(numberMin) || 1

      let re = new RegExp(`[^a-zA-Z0-9${escapeSymbol}]`, 'g')
      let errMsg = `{#label#} only accepts letters${symbol ? ', ' : ' and '}numbers${symbol ? `, and "${symbol}"` : ''}`

      const input = helper.getInput()

      if (input.match(re)) return helper.markError(errMsg)

      if (alphaMin > 0) {
        re = new RegExp(`[a-zA-Z]{${alphaMin},}`, 'g')
        if (!input.match(re)) {
          errMsg = `{#label#} should include at least ${alphaMin} letter${alphaMin > 1 ? 's' : ''}`
          return helper.markError(errMsg)
        }
      }
      if (numberMin > 0) {
        re = new RegExp(`[0-9]{${numberMin},}`, 'g')
        if (!input.match(re)) {
          errMsg = `{#label#} should include at least ${alphaMin} number${numberMin > 1 ? 's' : ''}`
          return helper.markError(errMsg)
        }
      }
    }

    describe(`string().alphanumeric()`, async () => {
      it(`通過: 'caro123'`, async () => {
        const input = `caro123`
        const info = await cc.string().alphanumeric().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 'caro_123'`, async () => {
        const input = `caro_123`
        const info = await cc.string().alphanumeric().parse(input)
        assert.strictEqual(info.error, `the input only accepts letters and numbers`)
      })
    })

    describe(`string().alphanumeric({symbol: '_'})`, async () => {
      const arg = {symbol: '_'}

      it(`通過: 'caro_123'`, async () => {
        const input = `caro_123`
        const info = await cc.string().alphanumeric(arg).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 'caro.123'`, async () => {
        const input = `carCo.123`
        const info = await cc.string().alphanumeric(arg).parse(input)
        assert.strictEqual(info.error, `the input only accepts letters, numbers, and "_"`)
      })
    })

    describe(`string().alphanumeric({alphaMin: 3, numberMin: 3})`, async () => {
      const arg = {alphaMin: 3, numberMin: 3}

      it(`通過: 'caro123'`, async () => {
        const input = `caro123`
        const info = await cc.string().alphanumeric(arg).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 'caro12'`, async () => {
        const input = `caro12`
        const info = await cc.string().alphanumeric(arg).parse(input)
        assert.strictEqual(info.error, `the input should include at least 3 numbers`)
      })
      it(`不通過: 'ca123'`, async () => {
        const input = `ca123`
        const info = await cc.string().alphanumeric(arg).parse(input)
        assert.strictEqual(info.error, `the input should include at least 3 letters`)
      })
    })
  })

  describe(`string().email() - 支援檢查 email 格式`, async () => {
    cc.string.postRule.email = (helper) => {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (String(helper.getInput()).toLowerCase().match(re)) return
      helper.markError(`{#label#} should be an email`)
    }

    const errMsg = `the input should be an email`

    it(`通過: 'caro@email.com'`, async () => {
      const input = 'caro@email.com'
      const info = await cc.string().email().parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`不通過: 'caro@email@com'`, async () => {
      const input = 'caro@email@com'
      const info = await cc.string().email().parse(input)
      assert.strictEqual(info.error, errMsg)
    })
  })
})

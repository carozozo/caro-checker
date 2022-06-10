describe(__filename, () => {
  describe(`string().size([limit = 1]) - 檢查長度`, async () => {
    cc.string.postRule.size = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (input.length === limit) return
      helper.markError(`{#label} size should be ${limit}`)
    }

    describe(`string().size()`, async () => {
      const errMsg = `the input size should be 1`

      it(`通過: '1'`, async () => {
        const input = `1`
        const info = await cc.string().size().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().size().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`string().size(3)`, async () => {
      const size = 3
      const errMsg = `the input size should be ${size}`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().size(size).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().size(size).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{size: cc.number().required(), str: cc.string().size(cc.ref('size')).required()}`, async () => {
      const size = 3
      const errMsg = `str size should be ${size}`

      const plan = {
        size: cc.number().required(),
        str: cc.string().size(cc.ref('size')).required(),
      }

      it(`通過: {size, str: '123'}`, async () => {
        const input = {size, str: '123'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, str: '1234'}`, async () => {
        const input = {size, str: '1234'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`string().min([limit = 1]) - 檢查最小長度`, async () => {
    cc.string.postRule.min = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (input.length >= limit) return
      helper.markError(`{#label} size cannot be less than ${limit}`)
    }

    describe(`string().min()`, async () => {
      const errMsg = `the input size cannot be less than 1`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().min().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: ''`, async () => {
        const input = ''
        const info = await cc.string().min().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`string().min(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be less than ${limit}`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1'`, async () => {
        const input = '1'
        const info = await cc.string().min(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{min: cc.number().required(), str: cc.string().min(cc.ref('min')).required()}`, async () => {
      const min = 3
      const errMsg = `str size cannot be less than ${min}`

      const plan = {
        min: cc.number().required(),
        str: cc.string().min(cc.ref('min')).required(),
      }

      it(`通過: {size, str: '123'}`, async () => {
        const input = {min, str: '123'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, str: '1'}`, async () => {
        const input = {min, str: '1'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`string().max([limit = 1]) - 檢查最大長度`, async () => {
    cc.string.postRule.max = (helper, limit) => {
      const input = helper.getInput()

      limit = helper.extractRef(limit) || 1

      if (input.length <= limit) return
      helper.markError(`{#label} size cannot be greater than ${limit}`)
    }

    describe('string().max()', async () => {
      const errMsg = `the input size cannot be greater than 1`

      it(`通過: '1'`, async () => {
        const input = `1`
        const info = await cc.string().max().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().max().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe('string().max(3)', async () => {
      const limit = 3
      const errMsg = `the input size cannot be greater than ${limit}`

      it(`通過: '123'`, async () => {
        const input = `123`
        const info = await cc.string().max(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '1234'`, async () => {
        const input = `1234`
        const info = await cc.string().max(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{max: cc.number().required(), str: cc.string().max(cc.ref('max')).required()}`, async () => {
      const max = 3
      const errMsg = `str size cannot be greater than ${max}`

      const plan = {
        max: cc.number().required(),
        str: cc.string().max(cc.ref('max')).required(),
      }

      it(`通過: {size, str: '123'}`, async () => {
        const input = {max, str: '123'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, str: '1234'}`, async () => {
        const input = {max, str: '1234'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`string().numeric() - 支援檢查數字格式`, async () => {
    cc.string.postRule.numeric = (helper) => {
      if (!Number.isNaN(Number(helper.getInput()))) return
      helper.markError(errMsg)
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
      let errMsg = `the input only accepts English letters${symbol ? ', ' : ' and '}numbers${symbol ? `, and "${symbol}"` : ''}`

      const input = helper.getInput()

      if (input.match(re)) return helper.markError(errMsg)

      if (alphaMin > 0) {
        re = new RegExp(`[a-zA-Z]{${alphaMin},}`, 'g')
        if (!input.match(re)) {
          errMsg = `the input should include at least ${alphaMin} letter${alphaMin > 1 ? 's' : ''}`
          return helper.markError(errMsg)
        }
      }
      if (numberMin > 0) {
        re = new RegExp(`[0-9]{${numberMin},}`, 'g')
        if (!input.match(re)) {
          errMsg = `the input should include at least ${alphaMin} number${numberMin > 1 ? 's' : ''}`
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
        assert.strictEqual(info.error, `the input only accepts English letters and numbers`)
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
        assert.strictEqual(info.error, `the input only accepts English letters, numbers, and "_"`)
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
    const errMsg = `the input should be an email`

    cc.string.postRule.email = (helper) => {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (String(helper.getInput()).toLowerCase().match(re)) return
      helper.markError(errMsg)
    }

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

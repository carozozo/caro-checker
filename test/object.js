describe(__filename, () => {
  describe(`object([plan]) - 檢查輸入值為物件`, async () => {
    describe(`object()`, async () => {
      const errMsg = `the input only accepts Object`

      it(`通過: {}`, async () => {
        const input = {}
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: Object.create(null)`, async () => {
        const input = Object.create(null)
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: Object(null)`, async () => {
        const input = Object(null)
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: []`, async () => {
        const input = []
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: null`, async () => {
        const input = null
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: function () {}`, async () => {
        const input = function () {}
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: 'str'`, async () => {
        const input = `str`
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: 123`, async () => {
        const input = 123
        const info = await cc.object().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object({base: cc.string(), obj: {b: cc.number()}, val: 1, val2: ['one', 'two']})`, async () => {
      const plan = {base: cc.string(), obj: {b: cc.number()}, val: 1, val2: ['one', 'two']}

      it(`通過: {base: 'str', obj: {b: 3}, val: 1, val2: 'one'}`, async () => {
        const input = {base: 'str', obj: {b: 3}, val: 1, val2: 'one'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {base: 'str', obj: {b: 3}, val: 1, val2: 'two'}`, async () => {
        const input = {base: 'str', obj: {b: 3}, val: 1, val2: 'two'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {base: 'str', obj: 'err', val: 1, val2: 'two'}`, async () => {
        const errMsg = `obj only accepts Object`
        const input = {base: 'str', obj: 'err', val: 1, val2: 'two'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `obj`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {base: 'str', obj: {b: 'err'}, val: 1, val2: 'one'}`, async () => {
        const errMsg = `b only accepts Number`
        const input = {base: 'str', obj: {b: 'err'}, val: 1, val2: 'one'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `obj.b`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {base: 'str', obj: {b: 3}, val: 'err', val2: 'one'}`, async () => {
        const errMsg = `val only accepts 1`
        const input = {base: 'str', obj: {b: 3}, val: 'err', val2: 'one'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `val`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {base: 'str', obj: {b: 3}, val: 1, val2: 'err'}`, async () => {
        const errMsg = `val2 only accepts "one" or "two"`
        const input = {base: 'str', obj: {b: 3}, val: 1, val2: 'err'}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `val2`)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object({arg1: cc.object({arg2: 'str'})})`, async () => {
      const plan = {arg1: cc.object({arg2: 'str'})}

      it(`通過: {arg1: {arg2: 'str'}}`, async () => {
        const input = {arg1: {arg2: `str`}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {arg1: {arg2: 'str'}}`, async () => {
        const input = {arg1: undefined}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {arg: 1}`, async () => {
        const errMsg = `arg1 only accepts Object`
        const input = {arg1: 1}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `arg1`)
        assert.strictEqual(info.error, errMsg)
      })
      it(`不通過: {arg1: {arg2: 1}}`, async () => {
        const errMsg = `arg2 only accepts "str"`
        const input = {arg1: {arg2: 1}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.route, `arg1.arg2`)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`object().size([limit = 1]) - 檢查長度`, async () => {
    describe(`object().size()`, async () => {
      const errMsg = `the input size should be 1`

      it(`通過: {a: 1}`, async () => {
        const input = {a: 1}
        const info = await cc.object().size().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().size().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object().size(3)`, async () => {
      const size = 3

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().size(size).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().size(size).parse(input)
        assert.strictEqual(info.error, `the input size should be ${size}`)
      })
    })

    describe(`{size: cc.number().required(), obj: cc.object().size(cc.ref('size')).required()}`, async () => {
      const size = 3
      const errMsg = `obj size should be ${size}`

      const plan = {
        size: cc.number().required(),
        obj: cc.object().size(cc.ref('size')).required(),
      }

      it(`通過: {size, obj: {a: 1, b: 2, c: 3}}`, async () => {
        const input = {size, obj: {a: 1, b: 2, c: 3}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, obj: {a: 1, b: 2, c: 3, d: 4}}`, async () => {
        const input = {size, obj: {a: 1, b: 2, c: 3, d: 4}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`object().min([limit = 1]) - 檢查最小長度`, async () => {
    describe(`object().min()`, async () => {
      const errMsg = `the input size cannot be less than 1`

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().min().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {}`, async () => {
        const input = {}
        const info = await cc.object().min().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object().min(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be less than ${limit}`

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: 1, b: 2, c: 3, d: 4}`, async () => {
        const input = {a: 1, b: 2, c: 3, d: 4}
        const info = await cc.object().min(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().min(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{min: cc.number().required(), obj: cc.object().min(cc.ref('min')).required()}`, async () => {
      const min = 3
      const errMsg = `obj size cannot be less than ${min}`

      const plan = {
        min: cc.number().required(),
        obj: cc.object().min(cc.ref('min')).required(),
      }

      it(`通過: {size, obj: {a: 1, b: 2, c: 3}}`, async () => {
        const input = {min, obj: {a: 1, b: 2, c: 3}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, obj: {a: 1}}`, async () => {
        const input = {min, obj: {a: 1}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`object().max([limit = 1]) - 檢查最大長度`, async () => {
    describe(`object().max()`, async () => {
      const errMsg = `the input size cannot be greater than 1`

      it(`通過: {a: 1}`, async () => {
        const input = {a: 1}
        const info = await cc.object().max().parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2}`, async () => {
        const input = {a: 1, b: 2}
        const info = await cc.object().max().parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`object().max(3)`, async () => {
      const limit = 3
      const errMsg = `the input size cannot be greater than ${limit}`

      it(`通過: {a: 1, b: 2, c: 3}`, async () => {
        const input = {a: 1, b: 2, c: 3}
        const info = await cc.object().max(limit).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: 1, b: 2, c: 3, d: 4}`, async () => {
        const input = {a: 1, b: 2, c: 3, d: 4}
        const info = await cc.object().max(limit).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })

    describe(`{max: cc.number().required(), obj: cc.object().max(cc.ref('max')).required()}`, async () => {
      const max = 3
      const errMsg = `obj size cannot be greater than ${max}`

      const plan = {
        max: cc.number().required(),
        obj: cc.object().max(cc.ref('max')).required(),
      }

      it(`通過: {size, obj: {a: 1, b: 2, c: 3}`, async () => {
        const input = {max, obj: {a: 1, b: 2, c: 3}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {size, obj: {a: 1, b: 2, c: 3, d: 4}}`, async () => {
        const input = {max, obj: {a: 1, b: 2, c: 3, d: 4}}
        const info = await cc.object(plan).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })
})

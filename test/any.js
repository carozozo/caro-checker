describe(__filename, () => {
  describe(`any([...enums]) - 檢查輸入值為任何格式`, async () => {
    describe(`any()`, async () => {
      it(`通過: undefined`, async () => {
        const input = undefined
        const info = await cc.any().parse(input)
        assert.strictEqual(info.error, undefined)
      })
    })

    describe(`any(cc.string(), cc.ref('elem'), undefined)`, async () => {
      const errMsg = `the input only accepts String or 3 or undefined`
      const args = [cc.any(cc.string(), 3, undefined)];

      it(`通過: 'str'`, async () => {
        const input = 'str'
        const info = await cc.any(...args).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: 3`, async () => {
        const input = 3
        const info = await cc.any(...args).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: undefined`, async () => {
        const input = undefined
        const info = await cc.any(...args).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 2`, async () => {
        const input = 2
        const info = await cc.any(...args).parse(input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`any().getType() - 取得檢查類型`, async () => {
    it(`any().getType()`, async () => {
      const val = cc.any().getType()
      assert.strictEqual(val, 'Any')
    })
  })

  describe(`any().getInput() - 取得輸入值`, async () => {
    it(`any().getInput()`, async () => {
      const input = 'gg'
      const schema = cc.any()

      await schema.parse(input)

      const val = schema.getInput()
      assert.strictEqual(val, input)
    })
  })

  describe(`any().required([boolean = true]).getRequired() - 設置並取得是否必填`, async () => {
    const errMsg = `the input is required`

    it(`any().required().getRequired()`, async () => {
      const arg = undefined
      const required = await cc.any().required(arg).getRequired()
      assert.strictEqual(required, true)
    })
    it(`any().required(false).getRequired()`, async () => {
      const arg = false
      const required = await cc.any().required(arg).getRequired()
      assert.strictEqual(required, false)
    })
    it(`any().required().parse()`, async () => {
      const arg = undefined
      const info = await cc.any().required(arg).parse()
      assert.strictEqual(info.error, errMsg)
    })
    it(`any().required(false).parse()`, async () => {
      const arg = false
      const info = await cc.any().required(arg).parse()
      assert.strictEqual(info.error, undefined)
    })
  })

  describe(`any().skip([boolean = true]).getSkip() - 設置並取得是否跳過檢查`, async () => {
    it(`any().skip().getSkip()`, async () => {
      const arg = undefined
      const skip = await cc.any().skip(arg).getSkip()
      assert.strictEqual(skip, true)
    })
    it(`any().skip(false).getSkip()`, async () => {
      const arg = false
      const skip = await cc.any().skip(arg).getSkip()
      assert.strictEqual(skip, false)
    })
    it(`any().skip().required()`, async () => {
      const info = await cc.any().skip().required().parse(undefined, true)
      assert.strictEqual(info.skip, true)
      assert.strictEqual(info.error, undefined)
    })
  })

  describe(`any().default(anything).getDefault() - 設置並取得預設值`, async () => {
    const val = 'def'

    it(`any().default('def').getDefault()`, async () => {
      const def = cc.any().default(val).getDefault()
      assert.strictEqual(def, val)
    })
    it(`any().default('def').parse('val')`, async () => {
      const input = 'val'
      const info = await cc.any().default(val).parse(input, true)
      assert.strictEqual(info.default, val)
      assert.strictEqual(info.input, input)
    })
    it(`any().default('def').parse(undefined)`, async () => {
      const input = undefined
      const info = await cc.any().default(val).parse(input, true)
      assert.strictEqual(info.default, val)
      assert.strictEqual(info.input, val)
    })
  })

  describe(`any().label(string).getLabel() - 設置並取得標籤`, async () => {
    const val = `label`
    const errMsg = `${val} is required`

    it(`any().label('label').getLabel()`, async () => {
      const label = cc.any().label(val).getLabel()
      assert.strictEqual(label, val)
    })
    it(`any().label('label').required().parse()`, async () => {
      const info = await cc.any().label(val).required().parse(undefined, true)
      assert.strictEqual(info.label, val)
      assert.strictEqual(info.error, errMsg)
    })
  })

  describe(`any().warning(string).getWarning() - 設置並取得警告`, async () => {
    const val = `warning`

    it(`any().warning('warning').getWarning()`, async () => {
      const warning = cc.any().warning(val).getWarning()
      assert.strictEqual(warning, val)
    })
    it(`any().warning('label').insertPre((helper) => helper.markError()).parse()`, async () => {
      const info = await cc.any().warning(val).insertPre((helper) => {
        helper.markError()
      }).parse(undefined, true)
      assert.strictEqual(info.warning, val)
      assert.strictEqual(info.error, val)
    })
  })

  describe(`any().note(string).getNote() - 設置並取得註解`, async () => {
    const val = `note`

    it(`any().note('route').getNote()`, async () => {
      const note = cc.any().note(val).getNote()
      assert.strictEqual(note, val)
    })
  })

  describe(`any().insertPre(function) - 設置前置規則`, async () => {
    it(`any().insertPre((helper) => {}).parse()`, async () => {
      const errMsg = 'err'
      const input = 1

      const info = await cc.any().insertPre((helper) => {
        assert.strictEqual(helper.getInput(), input)
        helper.markError(errMsg)
      }).parse(input, true)

      assert.strictEqual(info.doneRules.includes('insertPre'), true)
      assert.strictEqual(info.error, errMsg)
    })
    it(`any().insertPre((helper) => {}, 'customPre').parse()`, async () => {
      const errMsg = 'err'
      const fnName = 'customPre'
      const input = 1

      const info = await cc.any().insertPre((helper) => {
        assert.strictEqual(helper.getInput(), input)
        helper.markError(errMsg)
      }, fnName).parse(input, true)

      assert.strictEqual(info.doneRules.includes(fnName), true)
      assert.strictEqual(info.error, errMsg)
    })
  })

  describe(`any().insertPost(function) - 設置後置規則`, async () => {
    it(`any().insertPost((helper) => {}).parse()`, async () => {
      const errMsg = 'This is error'
      const input = 1

      const info = await cc.any().insertPost((helper) => {
        assert.strictEqual(helper.getInput(), input)
        helper.markError(errMsg)
      }).parse(input, true)

      assert.strictEqual(info.doneRules.includes('insertPost'), true)
      assert.strictEqual(info.error, errMsg)
    })
    it(`any().insertPost((helper) => {}, 'customPost').parse()`, async () => {
      const errMsg = 'This is error'
      const fnName = 'customPost'
      const input = 1

      const info = await cc.any().insertPost((helper) => {
        assert.strictEqual(helper.getInput(), input)
        helper.markError(errMsg)
      }, fnName).parse(input, true)

      assert.strictEqual(info.doneRules.includes(fnName), true)
      assert.strictEqual(info.error, errMsg)
    })
  })

  describe(`any().allow(...enums) - 限定輸入值`, async () => {
    describe(`any().allow(1, cc.string()).parse()`, async () => {
      it(`通過: 1`, async () => {
        const input = 1
        const info = await cc.any().allow(1, cc.string()).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: 'str'`, async () => {
        const input = 'str'
        const info = await cc.any().allow(1, cc.string()).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 3`, async () => {
        const input = 3
        const info = await cc.any().allow(1, cc.string()).parse(input)
        assert.strictEqual(info.error, 'the input only accepts 1 or String')
      })
    })
  })

  describe(`any().forbid(...enums) - 不允許特定值`, async () => {
    describe(`any().forbid(1, cc.string()).parse()`, async () => {
      it(`通過: 3`, async () => {
        const input = 3
        const info = await cc.any().forbid(1, cc.string()).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 1`, async () => {
        const input = 1
        const info = await cc.any().forbid(1, cc.string()).parse(input)
        assert.strictEqual(info.error, 'the input cannot be 1 or String')
      })
      it(`不通過: 'str'`, async () => {
        const input = 'str'
        const info = await cc.any().forbid(1, cc.string()).parse(input)
        assert.strictEqual(info.error, 'the input cannot be 1 or String')
      })
    })
  })
})

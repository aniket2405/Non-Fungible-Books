const BookStore = artifacts.require('BookStore')
const PurchaseToken = artifacts.require(
  'PurchaseToken'
)

contract('BookStore', (accounts) => {
  describe('Publshing', async () => {
    it('gives the author the specific version', async () => {
      const book_store = await BookStore.new()

      //  const book_id = 1
      //  const book_price = 50
      const price = web3.utils.toWei(
        '50',
        'ether'
      )
      const currency =
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const quantity = 100

      const author = accounts[5]

      await book_store.publish(
        quantity,
        price,
        currency,
        {
          from: author,
        }
      )

      let author_balance =
        await book_store.balanceOf(author, 1)

      author_balance = parseInt(author_balance)

      assert.equal(author_balance, 100)
    })
    it('updates the book ID', async () => {
      const book_store = await BookStore.new()

      const price = web3.utils.toWei(
        '50',
        'ether'
      )
      const currency =
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const quantity = 100

      const author = accounts[3]
      await book_store.publish(
        75,
        price,
        currency,
        {
          from: author,
        }
      )
      await book_store.publish(
        50,
        price,
        currency,
        {
          from: author,
        }
      )
      let author_balance =
        await book_store.balanceOf(author, 2)

      author_balance = parseInt(author_balance)

      assert.equal(author_balance, 50)
    })
    it('sets the price and currency correctly', async () => {
      const book_store = await BookStore.new()

      //  const book_id = 1
      //  const book_price = 50
      let price = web3.utils.toWei('50', 'ether')
      const currency =
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const quantity = 100

      const author = accounts[5]

      await book_store.publish(
        quantity,
        price,
        currency,
        {
          from: author,
        }
      )

      let book_version_price =
        await book_store.bookVersionPrice(1)

      book_version_price = web3.utils.fromWei(
        book_version_price,
        'ether'
      )

      assert.equal(book_version_price, 50)

      price = web3.utils.toWei('100', 'ether')

      await book_store.publish(
        quantity,
        price,
        currency,
        {
          from: author,
        }
      )

      book_version_price =
        await book_store.bookVersionPrice(2)

      book_version_price = web3.utils.fromWei(
        book_version_price,
        'ether'
      )

      assert.equal(book_version_price, 100)

      let book_version_currency =
        await book_store.bookVersionCurrency(1)

      let actual_currency =
        await web3.utils.toChecksumAddress(
          '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
        )

      assert.equal(
        book_version_currency,
        actual_currency
      )
    })
  })

  describe('Purchasing from the author', async () => {
    it('allows an account to purchase a book version', async () => {
      const book_store = await BookStore.new()
      const buyer = accounts[1]
      const purchase_token =
        await PurchaseToken.new(
          web3.utils.toWei('1000000', 'ether'),
          { from: buyer }
        )

      let balance =
        await purchase_token.balanceOf(buyer)

      balance = web3.utils.fromWei(
        balance,
        'ether'
      )
      assert.equal(balance, '1000000')

      //  const book_id = 1
      //  const book_price = 50
      let price = web3.utils.toWei('50', 'ether')
      const currency =
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const quantity = 100

      const author = accounts[5]

      await book_store.publish(
        quantity,
        price,
        currency,
        {
          from: author,
        }
      )

      let book_version_price =
        await book_store.bookVersionPrice(1)

      book_version_price = web3.utils.fromWei(
        book_version_price,
        'ether'
      )

      assert.equal(book_version_price, 50)
    })
  })
})

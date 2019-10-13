const { User } = require('../../src/app/models');
const bcrypt = require('bcryptjs');
const truncate = require('../utils/truncate');
 describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('shoud encrypt user password', async () => {
    const user = await User.create({
      name: 'Douglas', 
      email: 'douglasfazion@gmail.com', 
      password: '123'
    });

    const hash = await bcrypt.hash('123', 8);

    expect(await bcrypt.compare('123', user.password_hash)).toBe(true);
  });
 });


const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Import ứng dụng của bạn (index.js)
const expect = chai.expect;

chai.use(chaiHttp);

describe('Authentication Route', function () {
  it('should authenticate a user', function (done) {
    chai
      .request(app)
      .post('/api/auth')
      .send({ email: 'abg@com.au', upwd: '123' })
      .end(function (err, res) {
        expect(res).to.have.status(200);

        // Kiểm tra nội dung phản hồi và các trường thông tin người dùng
        expect(res.body).to.have.property('valid', true);
        expect(res.body).to.have.property('email', 'abg@com.au');
        expect(res.body).to.have.property('username');
        expect(res.body).to.have.property('role');
        expect(res.body).to.have.property('id');

        done();
      });
  });

  // Bạn có thể thêm các bài kiểm tra khác ở đây cho các trường hợp khác.
});


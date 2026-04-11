'use strict';

const { Controller } = require('egg');
const COS = require('cos-nodejs-sdk-v5');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileController extends Controller {
  // POST /api/upload
  async upload() {
    const { ctx, app } = this;
    const { secretId, secretKey, bucket, region, domain } = app.config.cos;

    if (!secretId || !secretKey) {
      ctx.status = 500;
      ctx.body = { code: 500, message: 'COS 未配置' };
      return;
    }

    const stream = await ctx.getFileStream();
    if (!stream) {
      ctx.status = 400;
      ctx.body = { code: 400, message: '未接收到文件' };
      return;
    }

    const ext = path.extname(stream.filename || '').toLowerCase() || '.jpg';
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.pdf'];
    if (!allowedExts.includes(ext)) {
      ctx.status = 400;
      ctx.body = { code: 400, message: `不支持的文件类型: ${ext}` };
      return;
    }

    const date = new Date();
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    const key = `uploads/${datePath}/${uuidv4()}${ext}`;

    const cos = new COS({ SecretId: secretId, SecretKey: secretKey });

    try {
      await new Promise((resolve, reject) => {
        cos.putObject({
          Bucket: bucket,
          Region: region,
          Key: key,
          Body: stream,
          ContentType: stream.mimeType || 'application/octet-stream',
        }, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (err) {
      ctx.logger.error('[COS Upload Error]', err);
      ctx.status = 500;
      ctx.body = { code: 500, message: `上传失败: ${err.message || err.code}` };
      return;
    }

    const baseUrl = domain
      ? domain.replace(/\/$/, '')
      : `https://${bucket}.cos.${region}.myqcloud.com`;
    const fileUrl = `${baseUrl}/${key}`;

    ctx.body = { code: 0, message: '上传成功', data: { url: fileUrl, key } };
  }
}

module.exports = FileController;

# Test

Install deps.

    npm install

The hit the command:

    npm test

# Release

First install [bmp][] globally.

    gem install bmp

Then check the current version.

    bmp

This must show the current version number.

Then hit the command (when minor update):

    bmp -m

This updates the version numbers in the repository.

If the diff is ok, then hit:

    bmp -c

This commits the diff and creates the tag.

Then publish the project to npm:

    npm publish

And push tag to github:

    git push origin vX.Y.Z

If you want to update major or patch version, use `bmp -j` or `bmp -p` respectively.
